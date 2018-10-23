var gulp = require('gulp')
, minifyCss = require("gulp-minify-css")
, sass = require("gulp-sass")
, uglify = require("gulp-uglify")
, livereload = require('gulp-livereload');
 
var filePath = {
  build_dir: './.dist',
  sass:{ 
        src: ['./assets/scss/*.scss'], 
        dest: './.dist/**/*.css',
        dest_dir: './dist/css' 
  },
  js:{ 
        src: ['./assets/js/*.js'], 
        dest: './.dist/**/*.js',
        dest_dir: './dist/js' 
  },
  css:{ 
        src: ['./assets/css/*.css'], 
        dest: './.dist/**/*.css',
        dest_dir: './dist/css' 
  },
};

var server;
gulp.task('livereload', function() {
  server = livereload();
});

// csss minify task
gulp.task('css', function () {
    gulp.src(filePath.css.src) // path to your file
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/css'));
});
gulp.task('watch-css', function() {
  gulp.start('css');
  gulp.watch(filePath.css.src, ['css']);
  gulp.watch(filePath.css.dest).on('change', function(file) {
    console.log("Changed sass: " + file.path);
    server.changed(file.path); 
  });
});

 
// sass task
gulp.task('sass', function () {
    gulp.src(filePath.sass.src) // path to your file
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest(filePath.sass.dest_dir));
});
gulp.task('watch-sass', function() {
  gulp.start('sass');
  gulp.watch(filePath.sass.src, ['sass']);
  gulp.watch(filePath.sass.dest).on('change', function(file) {
    console.log("Changed sass: " + file.path);
    server.changed(file.path); 
  });
});
 
// js uglify task
gulp.task('js', function () {
    gulp.src(filePath.js.src) // path to your files
    .pipe(uglify())
    .pipe(gulp.dest(filePath.js.dest_dir));
});
gulp.task('watch-js', function() {
  gulp.start('js');
  gulp.watch(filePath.js.src, ['js']);
  gulp.watch(filePath.js.dest).on('change', function(file) {
    console.log("Changed sass: " + file.path);
    server.changed(file.path); 
  });
});

gulp.task('build', ['css', 'sass', 'js']);
gulp.task('watch', ['livereload', 'watch-css', 'watch-sass', 'watch-js']);
gulp.task('default', ['watch']);
