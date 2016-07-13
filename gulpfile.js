var gulp = require('gulp');
var uglify = require('gulp-uglify');
var pump = require('pump'); 
var del = require('del');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('clean', function(callback){
  return del(['./dist/']);
})
gulp.task('merge', function(callback){
  pump([
    browserify('./src/index.js',{standalone: "jsonSpread"}).bundle(),
    source('jsonSpread.js'),
    gulp.dest('./dist/')
  ],callback);
})
gulp.task('min', ['clean','merge'],function(callback){
  pump([
    gulp.src('./dist/*.js'),
    uglify({preserveComments:"license"}),
    sourcemaps.init(),
    rename({suffix: '.min'}),
    sourcemaps.write(),
    gulp.dest('./dist/')
  ],callback)
})
gulp.task('default', ['min']);



