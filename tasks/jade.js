'use strict';

let gulp = require('gulp');
let plumber = require('gulp-plumber');
let jade = require('gulp-jade');
let changed = require('gulp-changed');

gulp.task('jade', () => {
	gulp.src('src/pages/**/*.jade')
		.pipe(changed('extension/pages', { extension: '.html' }))
		.pipe(plumber())
		.pipe(jade())
		.pipe(gulp.dest('extension/pages'));
});
