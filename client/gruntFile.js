/**
 * @param {Object} grunt Grunt.
 */
module.exports = function(grunt) {

  var clientSrc = ['src/js/**/*.js', '!**/ol.js'];
  var serverSrc = [
    'server.js', 'server/**/*.js', 'models/**/*.js', 'api/**/*.js'
  ];
  var serverTestSrc = ['test/server/**/*.js'];

  grunt.initConfig({
    cafemocha: {
      options: {
        reporter: 'spec'
      },
      server: {
        src: serverTestSrc
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: __filename
      },
      client: {
        options: {
          jshintrc: 'src/js/.jshintrc'
        },
        src: clientSrc
      },
      server: {
        src: serverSrc
      },
      serverTest: {
        options: {
          jshintrc: 'test/server/.jshintrc'
        },
        src: serverTestSrc
      }
    },
    watch: {
      gruntfile: {
        files: __filename,
        tasks: ['jshint:gruntfile']
      },
      serverTest: {
        files: serverTestSrc,
        tasks: ['jshint:serverTest', 'cafemocha:server']
      },
      client: {
        files: clientSrc,
        tasks: ['jshint:client']
      },
      server: {
        files: serverSrc,
        tasks: ['jshint:server', 'cafemocha:server']
      }
    }
  });

  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'cafemocha']);

  grunt.registerTask('default', ['test']);

};