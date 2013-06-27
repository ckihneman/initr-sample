'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('initr.sample.json'),
    banner: '/*! <%= pkg.author.company %> <%= grunt.template.today("yyyy") %> */\n',
    // Task configuration.
    clean: {
      files: ['web/javascript/min'],
      temp: ['temp'],
    },
    concat: {
      options: {
        stripBanners: false,
        separator: '\n;/*! */\n',
      },
      dist: {
        src: [
          'web/javascript/vendor/consoleshiv.js',
          'web/javascript/vendor/initr.js',
          'web/javascript/initr.config.js',
        ],
        dest: 'temp/core.js',
      },
    },
    uglify: {
      options: {
        preserveComments : 'some',
      },
      core: {
        options: {
          banner: '<%= banner %>',
        },
        src: '<%= concat.dist.dest %>',
        dest: 'web/javascript/min/core.js',
      },
      min: {
        files: [
          {
            expand: true,
            cwd: 'web/javascript/',
            src: [
              '**/*.js',

              // Exclude all files in min folder.
              '!min/**/*.js',

              // And exclude all of our files to be built into `core.js`.
              '!vendor/consoleshiv.js',
              '!vendor/initr.js',
              '!initr.config.js',
            ],
            dest: 'web/javascript/min/',
          },
        ],
      },
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc',
        },
        src: 'Gruntfile.js',
      },
      src: {
        options: {
          jshintrc: '.jshintrc-src',
        },
        src: [
          'web/javascript/**/*.js',
          '!web/javascript/**/*.min.js',
          '!web/javascript/vendor/**/*.js',
          '!web/javascript/min/**/*.js',
        ]
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile'],
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src'],
      },
    },
    php: {
      server: {
        options: {
          port: 8000,
          base: 'web',
          keepalive : true,
          open: true,
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-php');

  grunt.registerTask('default', ['clean:files', 'jshint', 'concat', 'uglify', 'clean:temp']);

  // A quick server task for easy demo viewing.
  // Run `grunt server` from the command line.
  // Navigate to `http://localhost:9001/demos/` in your browser.
  grunt.registerTask('server', ['jshint', 'php']);

};
