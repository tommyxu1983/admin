/**
 * Created by Administrator on 2016/9/1.
 */

var gulp = require('gulp');
sass = require('gulp-sass');
uglify = require('gulp-uglify');
concat = require('gulp-concat');

/*function getFolders(dir) {
 return fs.readdirSync(dir)
 .filter(function(file) {
 return fs.statSync(path.join(dir, file)).isDirectory();
 });
 }*/

gulp.task('scss',function(){

    var root= './plugins/autoComplete/';


    return gulp.src(root+'*.scss')
        .pipe(sass())
        .pipe(gulp.dest(root))
});