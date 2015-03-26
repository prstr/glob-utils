"use strict";

var gulp = require('gulp')
  , rename = require('gulp-rename')
  , jsDoc2md = require('gulp-jsdoc-to-markdown');

gulp.task('docs', function() {
  return gulp.src('src/**/*.js')
    .pipe(jsDoc2md())
    .pipe(rename(function(file) {
      file.extname = '.md';
    }))
    .pipe(gulp.dest('docs'));
});




