module.exports = function(grunt) {
    var SIGN_META_START = /^\/\/ ==UserScript==[\s]*$/;
    var SIGN_META_END = /^\/\/ ==\/UserScript==[\s]*$/;
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        files: {
            source: 'src/main.js',
            build: 'dev/build.js',
            dist: 'dist/<%= pkg.name %>-<%= pkg.version %>.user.js',
            uglifydist: '<%= pkg.name %>-<%= pkg.version %>.min.user.js',
            metadata: grunt.file.read('src/metadata.userjs')
        },
        
        watch: {
            src: {
                files: ['<%= files.source %>', 'src/modules/**/*.js'],
                tasks: ['default']
            }
        },

        copy: {
            dev: {
                src: '<%= files.build %>',
                dest: '<%= files.dist %>',
                options: {
                    processContent: function(content) {
                        return grunt.template.process(grunt.config.data.files.metadata) + content;
                    }
                }
            },
        },        
        
        index: {
            dev: {
                source: '<%= files.source %>',
                build: '<%= files.build %>'
            },
            prod: {
                source: '<%= files.source %>',
                build: '<%= files.dist %>'
            }
        },
        
        uglify: {
            options: {
                mangle: true,
                banner: '<%= files.metadata %>'
            },
            src: {
                files: {
                    'dist/<%= files.uglifydist %>': '<%= files.dist %>'
                }
            }
        },
        
        shell: {
            browserify: {
                options: {
                    failOnError: true
                },
                command: 'browserify <%= files.source %> -o <%= files.build %>'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-shell');
    
    grunt.registerTask('default', ['shell:browserify', 'copy:dev']);
    grunt.registerTask('prod', ['default', 'uglify:src']);
}
