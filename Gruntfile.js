var exec = require('child_process').exec,
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('extension/manifest.json'),

		jshint: {
			extension: [
				'Gruntfile.js',
				'extension/scripts/**/*.js',
				'extension/tests/**/*.js'
			]
		},
		zip: {
			// zip for uploading to Google Web Store Dashboard
			chrome: {
				router: function (filepath) {
					var filename = path.basename(filepath);

					return filename === 'key.pem' ? 'extension/key.pem' : filepath;
				},

				src: ['extension/**', 'key.pem'],
				dest: 'dest/chime.zip'
			},
			extension: {
				cwd: 'extension/',
				src: ['extension/**'],
				dest: 'build/extension.zip'
			}
		},
		crx: {
			extension: {
				src: 'build/extension.zip',
				dest: 'dest/chime.crx'
			}
		},
		less: {
			extension: {
				options: {
					cleancss: false,
					compress: false
				},
				files: [
					{
						expand: true,
						src: '**/*.less',
						dest: 'extension/options/css',
						cwd: 'extension/options/less',
						ext: '.css'
					},
					{
						expand: true,
						src: '**/*.less',
						dest: 'extension/popup/css',
						cwd: 'extension/popup/less',
						ext: '.css'
					},
					{
						expand: true,
						src: '**/*.less',
						dest: 'extension/content/css',
						cwd: 'extension/content/less',
						ext: '.css'
					}
				]
			}
		},
		clean: ['build/', 'dest/'],
		watch: {
			less: {
				files: ['extension/*/less/**/*.less'],
				tasks: ['less:extension']
			}
		}
	});

	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-crx');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('check', function () {
		if (grunt.file.exists('key.pem')) {
			grunt.log.ok();
		} else {
			grunt.fail.fatal('File key.pem not found. ');
		}
	});

	grunt.registerTask('prepare', function () {
		grunt.file.mkdir('build/');
		grunt.file.mkdir('dest/');
		grunt.log.ok();
	});

	grunt.registerTask('compile-hotkeys-win32-cl', function () {
		var local_dir = path.join(__dirname, 'hotkey-servers/win32'),
			build_path = path.join(__dirname, 'build/'),
			done = this.async();

		exec('cl /Fo"' + build_path + '/" /EHsc main.cpp /link user32.lib /out:"' +
			path.join(build_path, 'chime-hs.exe') + '"',
			{ cwd: local_dir },
			function (error, stdout, stderr) {
				grunt.log.write(stdout);

				if (error) {
					grunt.fail.fatal(stderr);
				} else {
					grunt.log.ok();
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

	grunt.registerTask('build-extension', [
		'jshint',
		'check',
		'zip:extension',
		'crx:extension',
		'zip:chrome']);

	grunt.registerTask('default', [
		'clean',
		'prepare',
		'build-extension',
		'compile-hotkeys']);
};
