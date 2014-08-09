var exec = require('child_process').exec,
	path = require('path');

module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		manifest: grunt.file.readJSON('extension/manifest.json'),

		jshint: {
			extension: [
				'Gruntfile.js',
				'extension/**/*.js'
			]
		},

		clean: [
			'build',
			'extension/pages',
			'extension/templates',
			'extension/styles',
			'extension/vendor'
		],

		zip: {
			// zip for uploading to Google Web Store Dashboard
			chrome: {
				router: function (filepath) {
					var filename = path.basename(filepath);

					return filename === 'key.pem' ? 'extension/key.pem' : filepath;
				},

				src: ['extension/**', 'key.pem'],
				dest: 'build/chime.zip'
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
				dest: 'build/chime.crx'
			}
		},

		stylus: {
			styles: {
				options: {
					cleancss: false,
					compress: false
				},
				files: [{
					expand: true,
					src: '**/*.styl',
					dest: 'extension/styles',
					cwd: 'src/styles',
					ext: '.css'
				}]
			}
		},

		jade: {
			pages: {
				files: [{
					expand: true,
					src: '**/*.jade',
					dest: 'extension/pages',
					cwd: 'src/pages',
					ext: '.html'
				}]
			},

			templates: {
				files: {
					'extension/js/templates.js': 'src/templates/**/*.jade'
				},
				options: {
					amd: true,
					client: true,
					processName: function (name) {
						return path.basename(name, '.jade');
					}
				}
			}
		},

		watch: {
			stylus: {
				files: ['src/styles/**/*.styl'],
				tasks: ['stylus:styles'],
				options: {
					atBegin: true
				}
			},

			templates: {
				files: ['src/templates/**/*.jade'],
				tasks: ['jade:templates'],
				options: {
					atBegin: true
				}
			},

			pages: {
				files: ['src/pages/**/*.jade'],
				tasks: ['jade:pages'],
				options: {
					atBegin: true
				}
			}
		},

		concurrent: {
			watch: {
				tasks: ['watch:templates', 'watch:stylus', 'watch:pages'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-preen');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-crx');

	grunt.registerTask('check', function () {
		if (grunt.file.exists('key.pem')) {
			grunt.log.ok();
		} else {
			grunt.fail.fatal('File key.pem not found. ');
		}
	});

	grunt.registerTask('extension', ['check', 'zip:extension', 'crx:extension']);
	grunt.registerTask('build-extension', ['jshint', 'extension','zip:chrome']);

	grunt.registerTask('default', ['clean', 'build-extension']);
};
