var gulp = require('gulp'),
	stylus = require('gulp-stylus');

gulp.task('stylus', function () {
	gulp.src('src/styles/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('extension/styles'));
});