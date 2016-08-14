coffee = require 'gulp-coffee'
gulp = require 'gulp'
uglify = require 'gulp-uglify'

gulp.task 'build', ->
  gulp.src './src/**/*.coffee'
  .pipe coffee(bare: true)
  .pipe uglify()
  .pipe gulp.dest './lib/'
