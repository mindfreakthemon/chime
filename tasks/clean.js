var gulp = require('gulp'),
	del = require('del');

gulp.task('clean', function (callback) {
	del([
		'build',
		'extension/pages',
		'extension/styles',
		'extension/js',
		'extension/vendor'
	], callback);
});