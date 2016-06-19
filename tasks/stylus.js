'use strict';

let gulp = require('gulp');
let stylus = require('gulp-stylus');

gulp.task('stylus', () => {
	gulp.src('src/styles/**/*.styl')
		.pipe(stylus())
		.pipe(gulp.dest('extension/styles'));
});
