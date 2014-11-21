module.exports = function( grunt ) {

	'use strict';

	// time of tasks
	require('time-grunt')(grunt);
	
	// Load all tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		// importa package manifest - informações
		pkg: grunt.file.readJSON('package.json'),
  		
		// config
		config: {
			// Caminhos padrões
			paths: {
	            sass:   	'app/assets/scss',
	            js:     	'app/assets/js',
		        ftp: 		'www',
	            env: {
	                dev: 	'app',
	                dist: 	'dist'
	            }
			},
			meta: {
				banner: '/*\n' +
				' *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
				' *  <%= pkg.description %>\n' +
				' *  <%= pkg.url %>\n' +
				' *\n' +
				' *  Made by <%= pkg.author.name %>\n' +
				' */\n'
			}
        },
		
		// cssmin
		cssmin: {
			dist: {
				files:[
					{
						src: '<%= config.paths.env.dist %>/assets/css/main.css',
						dest: '<%= config.paths.env.dist %>/assets/css/main.css'
					}
				]
			}
		},
		
		// uncss
		uncss: {
		    options: {
		    	htmlroot: 'build',
		    	report: 'gzip'
		    },
			dist: {
				files:{
					'<%= config.paths.env.dist %>/assets/css/main.css': ['<%= config.paths.env.dist %>/index.html']
				}
			}
		},
		
		// css lint
		csslint: {
			dev: {
				csslintrc: '.csslintrc'
			},
			strict: {
				src: ['<%= config.paths.env.dev %>/assets/css/**/*']
			}
		},
		
		// compile scss
		compass: {
			dev: { 
				options: { 
					config: 'config.rb',
					sassDir: '<%= config.paths.sass %>',
					cssDir: '<%= config.paths.env.dev %>/assets/css',
                    outputStyle: 'compact',
                    noLineComments: false
				}
			}
		},
		
		// watch
		watch: {
			options: {
				// debounceDelay: 500
			},
			sass: {
				files: ['<%= config.paths.sass %>/**/*'],
				tasks: ['compass:dev', 'csslint:strict']
			},
			js: {
				files: ['<%= config.paths.js %>/**/*'],
				tasks: ['jshint:dev']
			}
		},
		
		// concat
		concat: {
			js: {
				src: ['<%= config.paths.env.dev %>/assets/js/*.js'],
				dest: '<%= config.paths.env.dist %>/assets/js/main.js'
			},
			css: {
				src: ['<%= config.paths.env.dev %>/assets/css/**/*.css'],
				dest: '<%= config.paths.env.dist %>/assets/css/main.css'
			}
		},
		
		// jshint
		jshint: {
			dev: {
				src: ['<%= config.paths.js %>/**/*']
			},
			beforeconcat: ['<%= config.paths.env.dev %>/assets/js/**/*.js'],
			afterconcat: ['<%= config.paths.env.dist %>/assets/js/main.js']
		},
		
        // uglify
		uglify: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.paths.env.dist %>/assets/js',
					src: 'main.js',
					dest: '<%= config.paths.env.dist %>/assets/js'
				}]
			}
		},

		//imagemin
	    imagemin: {
			options: {
			    optimizationLevel: 7,
			    progressive: true
			},
	        dist: {
	            files: [{
	            	expand: true,
	            	cwd: '<%= config.paths.env.dev %>/assets/img/',
	            	src: ['**/*.png','**/*.jpg','**/*.jpeg','**/*.gif'],
	            	dest: '<%= config.paths.env.dist %>/assets/img'
	            }]
	        }
	    }, 
	    
		//htmlmin
		htmlmin: {
			options: {
				removeCommentsFromCDATA: true,
				removeComments: true,
				collapseWhitespace: true,
				collapseBooleanAttributes: true,
				removeAttributeQuotes: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeOptionalTags: true,
				removeEmptyElements: false
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.paths.env.dev %>',
					src: '**/*.html',
					dest: '<%= config.paths.env.dist %>'
				}]
			}
		},

		//copy files
		copy: {
			dist: {
				expand: true,
				dot: true,
				cwd: '<%= config.paths.env.dev %>',
				src: [
					'*.*',
					'assets/fonts/**',
					'assets/js/vendor/*.js'
				],
				dest: '<%= config.paths.env.dist %>'
			},
		},

		// clean
		clean: {	
			dist: {
				src: ['<%= config.paths.env.dist %>']
			}
		},
		
		// exec commands
		exec: {
		    cmd: 'npm install && bower install && grunt dev'
		},
		
		// keep multiple browsers & devices in sync when building websites.
		browserSync: {
		    dev: {
		        bsFiles: {
		            src : [
		            	'<%= config.paths.env.dev %>/assets/css/**/*.css',
		            	'<%= config.paths.env.dev %>/assets/js/**/*.js',
		            	'<%= config.paths.env.dev %>/**/*.html'
		            ]
		        },
		        options: {
                    watchTask: true,
					server: {
						baseDir: "app/"
					},
					// proxy: {
					// 	host: "192.168.0.11",
					// 	port: 8000
					// }
                }
		    }
		},
		
		// deploy
		'ftp-deploy': {
			dist: {
				auth: {
					host: 'ftp.xxx.xxx', // ftp host
					port: 21,
					authKey: 'key1' //.ftppass file on the ./
				},
				src: '<%= config.paths.env.dev %>',
				dest: '<%= config.paths.ftp %>', // your remote directory
				exclusions: [
					'./**/.*', // all files what begin with dot
					'./**/Thumbs.db',
					'./**/README.md',
					'./**/*.zip'
				]
			}
		},
		
		// make a zipfile
		compress: {
			all: {
				options: {
					archive: 'all.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['./**'], dest: '' 
					},
				]
			},
			dist: {
				options: {
					archive: '<%= config.paths.env.dist %>.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['<%= config.paths.env.dist %>/**'], dest: '' 
					},
				]
			},
			dev: {
				options: {
					archive: 'dev.zip'
				},
				files: [
					{ 
						expand: true, cwd: './', src: ['<%= config.paths.env.dev %>/**'], dest: '' 
					},
				]
			}
		},
		
		// autoshot
		autoshot: {
			default_options: {
				options: {
					// necessary config
					path: '<%= config.paths.env.dev %>/screenshots',
					filename: 'screenshot',
					type: 'jpg',
					// optional config, must set either remote or local
					remote: {
						files: [
							{ src: 'http://www.globo.com', dest: 'remote-screenshot.png', delay: 800 }
						]
					},
					local: {
						path: '<%= config.paths.env.dev %>',
						port: 7788,
						files: [
							{ src: 'index.html', dest: 'local-screenshot.png', delay: 800 }
						]
					},
					viewport: ['1920x1080','1280x1024','1024x768','768x960','480x600','320x500'] 
				},
			},
		},

		// pagespeed
		pagespeed: {
			options: {
				nokey: true,
				url: "https://developers.google.com"
			},
			dist: {
				options: {
					url: "http://developers.google.com/speed/docs/insights/v1/getting_started",
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			},
			dev: {
				options: {
					paths: ["/speed/docs/insights/v1/getting_started", "/speed/docs/about"],
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			}
		}
	});

	// watch
	grunt.registerTask('dev', ['browserSync', 'watch']);

	// build
	grunt.registerTask('dist', ['clean', 'copy', 'concat', 'uncss', 'uglify', 'cssmin', 'imagemin', 'htmlmin']);
	
	// deploy
	grunt.registerTask('deploy', ['ftp-deploy:dist']);

	// compress
	grunt.registerTask('zip', ['compress:dist','compress:dev','compress:all']);    
};
		