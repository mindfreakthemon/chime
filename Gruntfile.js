var exec = require('child_process').exec,
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: [
				'Gruntfile.js',
				'extension/scripts/**/*.js',
				'extension/tests/**/*.js'
			]
		},
		zip: {
			chrome: {
				router: function (filepath) {
					var filename = path.basename(filepath);

					return filename === 'key.pem' ? 'extension/key.pem' : filepath;
				},

				src: ['extension/**', 'key.pem'],
				dest: 'build/chime.zip'
			}
		},

		build_path: path.join(__dirname, 'build')
	});

	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('clean', function () {
		grunt.file.delete(grunt.config('build_path'));
	});

	grunt.registerTask('prepare', function () {
		grunt.file.mkdir(grunt.config('build_path'));
	});

	grunt.registerTask('compile-hotkeys-win32-cl', function () {
		var local_dir = path.join(__dirname, 'hotkey-servers/win32'),
			done = this.async();

		exec('vcvarsall && cl /Fo"' + grunt.config('build_path') + '/" /EHsc main.cpp /link user32.lib /out:"' +
			path.join(grunt.config('build_path'), 'chime-hs.exe') + '"',
			{ cwd: local_dir },
			function (error, stdout, stderr) {
				if (error) {
					grunt.fail.fatal(stderr, 2);
				} else {
					grunt.log.write(stdout).ok();
				}

				done();
			});
	});

	grunt.registerTask('compile-hotkeys-win32-iscc', function () {
		var local_dir = path.join(__dirname, 'hotkey-servers/win32'),
			done = this.async();

		exec('iscc chime.iss',
			{ cwd: local_dir },
			function (error, stdout, stderr) {
				if (error) {
					grunt.fail.fatal(stderr, 2);
				} else {
					grunt.log.write(stdout).ok();
				}

				done();
			});
	});

	grunt.registerTask('compile-hotkeys-win32', ['compile-hotkeys-win32-cl', 'compile-hotkeys-win32-iscc']);

	grunt.registerTask('compile-hotkeys', ['compile-hotkeys-win32']);

	grunt.registerTask('pack-extension', function () {
		var done = this.async();

		exec('chrome --pack-extension="' + path.join(__dirname, 'extension') + '" --pack-extension-key="' + path.join(__dirname, 'key.pem') + '"',
			{ cwd: __dirname },
			function (error, stdout, stderr) {
				if (error) {
					grunt.fail.fatal(stderr, 2);
				} else {
					grunt.log.write(stdout).ok();

					var crx = path.join(__dirname, 'extension.crx');

					grunt.file.copy(crx, path.join(grunt.config('build_path'), 'chime.crx'));
					grunt.file.delete(crx);
				}

				done();
			});
	});

	grunt.registerTask('default', ['clean', 'prepare', 'compile-hotkeys', 'pack-extension', 'zip:chrome'])
};