'use strict';

let gulp = require('gulp');
let jshint = require('gulp-jshint');

gulp.task('jslint', () => {
	return gulp.src([
			'gulpfile.js',
			'tasks/**/*.js'
		])
		.pipe(jshint({
			linter: 'jshint-esnext',
			esnext: 7,
			experimental: ['asyncawait']
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jshint.reporter('fail'));
});