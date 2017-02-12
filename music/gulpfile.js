var gulp=require('gulp'),
	rename = require("gulp-rename"),
	minifyCss = require("gulp-minify-css"),
	uglify = require('gulp-uglify');


gulp.task('minify_css',function(){
	gulp.src('./css/main.css')
		.pipe(minifyCss())
	    .pipe(rename('main.min.css'))
	    .pipe(gulp.dest('./css'));
});
gulp.task('mainJS_min',function(){
    gulp.src('./js/main-withnot-compress.js')
        .pipe(uglify())
        .pipe(rename("main.js"))
        .pipe(gulp.dest('./js'));
});

//default
gulp.task('default',['minify_css','mainJS_min'],function(){
	console.log('23333');
});