'use strict';

let gulp = require('gulp');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let typescript = require('gulp-tsc');


gulp.task('typescript', () => {
	gulp.src(['./src/js/**/*.ts', './typings/browser.d.ts'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(typescript({
			module: 'system',
			target: 'es6'
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./extension/js'));


	// gulp.src(['./src/js/**/*.raw.ts', './typings/browser.d.ts'])
	// 	.pipe(plumber())
	// 	.pipe(sourcemaps.init())
	// 	.pipe(typescript({
	// 		module: 'system',
	// 		target: 'es6'
	// 	}))
	// 	.pipe(sourcemaps.write('.'))
	// 	.pipe(gulp.dest('./extension/js'));
});
