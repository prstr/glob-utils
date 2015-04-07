'use strict';

var glob = require('glob')
  , async = require('async')
  , fs = require('fs-extra')
  , path = require('path')
  , crypto = require('crypto')
  , gitignoreParser = require('gitignore-parser');

/**
 * Lookup files in `cwd` directory matching glob `pattern`.
 *
 * Dot-files (i.e. starting with dot) are not returned as per `glob` module.
 * Directories are not returned either.
 *
 * @param cwd {string} - (current work directory) a directory where lookup is
 *   performed; this path is also stripped from resulting file paths.
 * @param pattern {string} - glob pattern
 * @param cb {function} - callback `function(err, files)`,
 *   where `files` is an array of {@link GlobFile}
 * @see {@link https://github.com/isaacs/node-glob glob}
 * @module prostore.glob-utils
 */
module.exports = exports = function(cwd, pattern, cb) {
  async.parallel([
    function(cb) {
      glob(pattern, { cwd: cwd, nodir: true }, cb);
    },
    function(cb) {
      fs.readFile(path.join(cwd, '.gitignore'), 'utf-8', function(err, text) {
        // Error is swallowed intentionally
        cb(null, text || '');
      });
    }
  ], function(err, res) {
    /* istanbul ignore if */
    if (err) return cb(err);
    var gitignore = gitignoreParser.compile(res[1] || '')
      , files = res[0].filter(function(file) {
        return gitignore.accepts(file);
      });
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

/**
 * Compares two lists of file descriptors yielding four arrays:
 *
 *   * `added` — files existing in `src` but missing in `dst`
 *   * `removed` — files existing in `dst` but missing in `src`
 *   * `modified` — files existing in both `src` and `dst` but with different `md5`
 *   * `unmodified` — files with equal content in both `src` and `dst`
 *
 * @param {GlobFile[]} src
 * @param {GlobFile[]} dst
 */
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

/**
 * Copies files (either by array of {@link GlobFile} or by pattern)
 * to specified `target` directory, mkdirping it if it doesn't exist yet.
 *
 * @param {string} cwd - current work directory
 * @param {GlobFile[]} files - string pattern or an array of GlobFile
 * @param {string} target - directory to copy into
 * @param cb {function} - callback `function(err, files)`,
 */
exports.copy = function(cwd, files, target, cb) {
  if (typeof files == 'string') {
    exports(cwd, files, function(err, files) {
      if (err) return cb(err);
      _copy(cwd, files, target, cb);
    });
  } else _copy(cwd, files, target, cb);
};

/**
 * Internal function of {@link copy}, accepts GlobFiles[].
 */
function _copy(cwd, files, target, cb) {
  async.each(files, function(file, cb) {
    var srcFile = path.join(cwd, file.path)
      , dstFile = path.join(target, file.path);
    fs.mkdirp(path.dirname(dstFile), function(err) {
      if (err) return cb(err);
      fs.copy(srcFile, dstFile, cb);
    });
  }, cb);
}

/**
 * Search an array by applying predicate function to each element.
 * If found, the element is removed from original array.
 *
 * @param {Array} arr - array to search in
 * @param {function(elem, index, array)} fn - predicate function
 * @param {*} thisArg - optional value for `this` in predicate function
 * @returns {*} element found or `null`
 * @private
 */
function findAndRemove(arr, fn, thisArg) {
  for (var i = 0; i < arr.length; i++) {
    var elem = arr[i];
    if (fn.call(thisArg, elem, i, arr))
      return arr.splice(i, 1)[0];
  }
}

/**
 * File descriptor object.
 *
 * Example:
 *
 * ```js
 * {
 *   path: 'path/to/file/relative/to/cwd',
 *   mtime: 1234567890,
 *   md5: 'd41d8cd98f00b204e9800998ecf8427e'
 * }
 * ```
 *
 * @typedef {object} GlobFile
 * @property {string} path - path relative to `cwd`
 * @property {number} mtime - last modification timestamp
 * @property {string} md5 - md5 hash of file content
 */
