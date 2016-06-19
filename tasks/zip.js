'use strict';

let gulp = require('gulp');
let merge = require('merge2');
let zip = require('gulp-zip');

gulp.task('zip', function () {
	return merge(
		gulp.src('extension/**/*', { base: 'extension/' }),
		gulp.src('key.pem')
	)
		.pipe(zip('chime.zip'))
		.pipe(gulp.dest('build'));
});
