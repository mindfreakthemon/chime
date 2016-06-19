'use strict';

let gulp = require('gulp');
let plumber = require('gulp-plumber');
let sourcemaps = require('gulp-sourcemaps');
let babel = require('gulp-babel');

gulp.task('babel', () => {
	gulp.src(['./src/js/**/*.js', '!./src/js/**/*.raw.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			plugins: [
				'transform-es2015-parameters',
				'transform-es2015-classes',
				'transform-es2015-object-super',
				'transform-es2015-modules-systemjs',
				'transform-es2015-destructuring',
				'transform-strict-mode',
				'syntax-async-functions',
				'syntax-async-generators',
				'transform-regenerator',
				'transform-async-to-generator'
			]
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./extension/js'));

	gulp.src('./src/js/**/*.raw.js')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			plugins: [
				'transform-es2015-parameters',
				'transform-es2015-classes',
				'transform-es2015-object-super',
				'transform-es2015-destructuring',
				'transform-strict-mode',
				'syntax-async-functions',
				'syntax-async-generators',
				'transform-regenerator',
				'transform-async-to-generator'
			]
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./extension/js'));
});
