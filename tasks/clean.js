'use strict';

let gulp = require('gulp');
let del = require('del');

gulp.task('clean', callback => {
	del([
		'build',
		'extension/pages',
		'extension/styles',
		'extension/js',
		'extension/vendor'
	], callback);
});
