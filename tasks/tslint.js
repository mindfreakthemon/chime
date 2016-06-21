'use strict';

let gulp = require('gulp');
let tslint = require('gulp-tslint');

gulp.task('tslint', () => {
	return gulp.src([
		'src/js/**/*.ts'
	])
		.pipe(tslint({
			configuration: {
				rules: require('../tslint.json')
			}
		}))
		.pipe(tslint.report('verbose'));
});
