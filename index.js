'use strict';

var glob = require('glob');

module.exports = function(cwd, pattern, cb) {
  var files = [];
  var g = new glob.Glob(pattern, {
    cwd: cwd,
    nodir: true,
    stat: true
  });
  g.on('stat', function(file, stat) {
    files.push({
      file: file,
      mtime: stat.mtime.getTime()
    });
  });
  g.on('end', function() {
    cb(null, files);
  });
};
