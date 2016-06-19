'use strict';

let gulp = require('gulp');
let ChromeExtension = require('crx');
let fs = require('fs');

gulp.task('crx', ['zip'], () => {
	let crx = new ChromeExtension({
		privateKey: fs.readFileSync('key.pem')
	});

	crx.load('extension')
		.then(() => {
			return crx.pack().then(crxBuffer => fs.writeFile('build/chime.crx', crxBuffer));
		});
});
