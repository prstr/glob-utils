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
 *   * `added` — files existing in `local` but missing in `remote`
 *   * `removed` — files existing in `local` but missing in `remote`
 *   * `modified` — files existing in both `local` and `remote` but with different `md5`
 *   * `unmodified` — files with equal content in both `local` and `remote`
 *   * `updated` — modified files with mtime on `remote` greater than on `local`
 *   * `dirty` — modified files with mtime on `local` greater than on `remote`
 *
 * This method is O(N * M) in worst case with N, M being the sizes of
 * local and remote arrays respectively.
 *
 * @param {GlobFile[]} local
 * @param {GlobFile[]} remote
 */
exports.diff = function(local, remote) {
  var added = []
    , modified = []
    , unmodified = []
    , dirty = []
    , updated = []
    , _remote = remote.slice();
  local.forEach(function(l) {
    var r = findAndRemove(_remote, function(r) {
      return r.path == l.path;
    });
    if (!r) {
      added.push(l);
      return;
    }
    if (l.md5 && l.md5 == r.md5)
      unmodified.push(r);
    else {
      modified.push(r);
      if (l.mtime >= r.mtime)
        dirty.push(r);
      else
        updated.push(r);
    }
  });
  return {
    added: added,
    removed: _remote,
    modified: modified,
    unmodified: unmodified,
    updated: updated,
    dirty: dirty,
    local: {
      newer: added.concat(dirty),
      missing: _remote
    },
    remote: {
      newer: _remote.concat(updated),
      missing: added
    }
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
