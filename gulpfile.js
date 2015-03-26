"use strict";

var gulp = require('gulp')
  , fs = require('fs')
  , jsdoc2md = require("jsdoc-to-markdown");

gulp.task('docs', function() {
  return jsdoc2md.render('src/**/*.js', {})
    .pipe(fs.createWriteStream('README.md'));
});




