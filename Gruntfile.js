module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: ['bower_components/normalize.css/normalize.css', 'bower_components/animate.css/animate.css', 'assets/css/simplechat.css'],
                dest: 'public/css/simplechat.css'
            },
            js: {
                src: ['bower_components/jquery/dist/jquery.js', 'bower_components/angular/angular.js', 'bower_components/moment/moment.js', 'node_modules/socket.io/node_modules/socket.io-client/socket.io.js' ,'bower_components/angular-socket-io/socket.js' , 'assets/js/simplechat.js'],
                dest: 'public/js/simplechat.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'public/js/simplechat.min.js': ['public/js/simplechat.js']
                }
            }
        },
        cssmin: {
            dist: {
                files: {
                    'public/css/simplechat.min.css': ['public/css/simplechat.css']
                }
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            dist: {
                files: {
                    'public/index.html': 'assets/html/index.html'
                }
            }
        },
        clean: {
            css: ['public/css/*.css', '!public/css/*.min.css'],
            js: ['public/js/*.js', '!public/js/*.min.js' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['concat', 'uglify', 'cssmin', 'htmlmin', 'clean']);

};
