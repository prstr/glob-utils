'use strict';

var glob = require('glob')
  , async = require('async')
  , fs = require('fs')
  , path = require('path')
  , crypto = require('crypto');

module.exports = exports = function(cwd, pattern, cb) {
  glob(pattern, { cwd: cwd, nodir: true }, function(err, files) {
    /* istanbul ignore if */
    if (err) return cb(err);
    async.map(files, function(file, cb) {
      var filename = path.resolve(cwd, file);
      fs.stat(filename, function(err, stat) {
        /* istanbul ignore if */
        if (err) return cb(err);
        var hash = crypto.createHash('md5')
          , stream = fs.createReadStream(filename, 'utf-8');
        stream.on('data', function(data) {
          hash.update(data);
        });
        stream.on('error', function(err) {
          cb(err);
        });
        stream.on('end', function() {
          cb(null, {
            path: file,
            md5: hash.digest('hex'),
            mtime: stat.mtime.getTime()
          });
        });
      });
    }, cb);
  });
};

exports.diff = function(src, dst) {
  var added = []
    , modified = []
    , unmodified = []
    , _dst = dst.slice();
  src.forEach(function(srcFile) {
    var dstFile = findAndRemove(_dst, function(dstFile) {
      return dstFile.path == srcFile.path;
    });
    if (!dstFile) {
      added.push(srcFile);
      return;
    }
    if (srcFile.md5 && srcFile.md5 == dstFile.md5)
      unmodified.push(dstFile);
    else
      modified.push(dstFile);
  });
  return {
    added: added,
    removed: _dst,
    modified: modified,
    unmodified: unmodified
  };
};

function findAndRemove(arr, fn, thisArg) {
  for (var i = 0; i < arr.length; i++) {
    var elem = arr[i];
    if (fn.call(thisArg, elem, i, arr))
      return arr.splice(i, 1)[0];
  }
}
