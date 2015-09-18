var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	jade = require('gulp-jade'),
	changed = require('gulp-changed');

gulp.task('jade', function () {
	gulp.src('src/pages/**/*.jade')
		.pipe(changed('extension/pages', { extension: '.html' }))
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('extension/pages'));
});