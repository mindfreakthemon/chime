var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel');

gulp.task('babel', function () {
	gulp.src(['./src/js/**/*.js', '!./src/js/**/*.raw.js'])
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(babel({
			plugins: [
				'transform-es2015-parameters',
				'transform-es2015-classes',
				'transform-es2015-object-super',
				'transform-es2015-modules-amd',
				'transform-es2015-destructuring',
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
				'syntax-async-functions',
				'syntax-async-generators',
				'transform-regenerator',
				'transform-async-to-generator'
			]
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('./extension/js'));
});
