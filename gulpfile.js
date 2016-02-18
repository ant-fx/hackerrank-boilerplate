'use strict';

const gulp = require('gulp');
const spawn = require('child_process').spawn;

gulp.task('default', function() {
  gulp.watch(['*.js', 'tests/*'], function() {
    spawn('node', ['testRunner.js'], {
      cwd: process.cwd(),
      stdio: 'inherit'
    });
  });
});
