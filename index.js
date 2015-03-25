'use strict';

var glob = require('glob');

module.exports = exports = function(cwd, pattern, cb) {
  var files = [];
  var g = new glob.Glob(pattern, {
    cwd: cwd,
    nodir: true,
    stat: true
  });
  g.on('stat', function(file, stat) {
    files.push({
      path: file,
      mtime: stat.mtime.getTime()
    });
  });
  g.on('end', function() {
    cb(null, files);
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
    if (srcFile.mtime < dstFile.mtime)
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
