module.exports = function(grunt) {
    //grunt wrapper function 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
          //grunt task configuration will go here
	ngAnnotate: {
	    dist: {
		files: [{
		        expand: true,
		        src: ['./angular/**/*.js', '!./angular/**/*.annotated.js'],
		        ext: '.annotated.js',
		        extDot: 'last'
		    }],
	    }
	},
	concat: {
	    dist: { //target
		src : ['./angular/*.annotated.js', './angular/*/*.annotated.js'],
		dest: './deploy/app.js'
	    }
	},

	uglify: {
	    js: { //target
		src: ['./deploy/app.js'],
		dest: './deploy/ugly.js'
	    }
	}     
    });




    //load grunt tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate'); 

    //register grunt default task
    grunt.registerTask('ugly', ['ngAnnotate','concat','uglify']);

}
