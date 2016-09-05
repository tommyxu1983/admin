/**
 * Created by Administrator on 2016/9/1.
 */

var gulp = require('gulp');
    sass = require('gulp-sass');
    uglify = require('gulp-uglify');
    concat = require('gulp-concat');

    gulp.task('scss',function(){
        return gulp.src('')
            .pipe(sass())
            .pipe(gulp.dest('dist/css'))
    });