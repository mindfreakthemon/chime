'use strict';

let gulp = require('gulp');
let path = require('path');
let through = require('through2');
let jade = require('gulp-jade');
let plumber = require('gulp-plumber');
let concat = require('gulp-concat');
let insert = require('gulp-insert');
let wrap = require('gulp-wrap-amd');

function modify() {
	function transform(file, enc, callback) {
		if (!file.isBuffer()) {
			this.push(file);
			callback();
			return;
		}

		var funcName = path.basename(file.path, '.js'),
			contents = file.contents.toString()
				.replace('function template(locals) {', 'tpl.' + funcName + ' = decorate.default(function (locals) {') + ')';

		file.contents = new Buffer(contents);

		this.push(file);

		callback();
	}

	return through.obj(transform);
}


function process(src, filename, dest) {
	gulp.src(src)
		.pipe(plumber())
		.pipe(jade({
			client: true
		}))
		.pipe(modify())
		.pipe(concat(filename))
		.pipe(insert.prepend('var tpl = {};'))
		.pipe(wrap({
			deps: ['jade', 'utils/templates.js'],
			params: ['jade', 'decorate'],
			exports: 'tpl'
		}))
		.pipe(gulp.dest(dest));
}

gulp.task('tpl', () => {
	process('src/templates/options/**/*.jade', 'options.js', 'extension/js/templates');
	process('src/templates/content/**/*.jade', 'content.js', 'extension/js/templates');
});
