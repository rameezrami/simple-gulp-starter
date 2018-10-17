var gulp = require('gulp'),
  debug = require('gulp-debug'),
  size = require('gulp-filesize'),
  clean = require('gulp-clean'),
  coffee = require('gulp-coffee'),
  coffeelint = require('gulp-coffeelint'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  imagemin = require('gulp-imagemin'),
  changed = require('gulp-changed'),
  livereload = require('gulp-livereload'),
  karma = require('gulp-karma'),
  protractor = require('gulp-protractor').protractor,
  webdriver_standalone = require('gulp-protractor').webdriver_standalone,
  webdriver_update = require('gulp-protractor').webdriver_update;

var filePath = {
  build_dir: './.build',
  lint:   { src: ['./app/app.coffee','./app/**/*.coffee'] },
  coffee: { 
            src: ['./app/**/*.coffee','!./app/**/*_spec.coffee'], 
            dest: './.build/**/*.js',
            dest_dir: './.build',          
          },
  vendor: { 
            src: ['./bower_components/**/*.{js,css}','./bower_components/**/fonts/*'], 
            dest_dir: './.build/bower_components' 
          },
  images: { 
            src: './app/**/*.{jpg,png,gif}',
            dest_dir: './.build'
          },
  data:   { 
            src: './app/data/**/*', 
            dest_dir: './.build/data' 
          },
  sass:   { 
            src: ['./app/**/*.scss'], 
            dest: './.build/**/*.css',
            dest_dir: './.build' 
          },
  html:   { 
            src: './app/**/*.html', 
            dest: './.build/**/*.html', 
            dest_dir: './.build' 
          },
  
  unit:   { 
            src: [
              'bower_components/angular/angular.js',
              'bower_components/angular-*/angular-*.js',
              'app/app.coffee',
              'app/modules/**/*.coffee',
              'app/modules/**/*_spec.coffee'
            ]
          },
  e2e:    { src: 'spec/e2e/**/*.coffee' }
};

var server;

gulp.task('unit', function() {
  // Be sure to return the stream
  return gulp.src(filePath.unit.src)
    .pipe(karma({
      configFile: './spec/config/karma-unit.conf.js',
      action: 'run'
    }));
});

gulp.task('webdriver_update', webdriver_update);
gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('e2e', ['webdriver_update'], function() {
  gulp.src(filePath.e2e.src)
    .pipe(protractor({
      configFile: "spec/config/protractor-e2e.config.js",
      args: ['--baseUrl', 'http://127.0.0.1:8000']
    }))    
  .on('error', function(e) { throw e })
});

gulp.task('livereload', function() {
  server = livereload();
});

gulp.task('clean', function() {
  return gulp.src(filePath.build_dir, {read: false})
    .pipe(clean());
});

gulp.task('lint', function () {
  gulp.src(filePath.lint.src)
    .pipe(coffeelint())
    .pipe(coffeelint.reporter())
});

gulp.task('vendor', function() {
  gulp.src(filePath.vendor.src)
    // .pipe(changed(filePath.vendor.dest_dir))
    .pipe(size())
    .pipe(gulp.dest(filePath.vendor.dest_dir));
});

gulp.task('images', function() {
  gulp.src(filePath.images.src)
    // .pipe(changed(filePath.images.dest_dir))
    .pipe(imagemin())
    .pipe(size())
    .pipe(gulp.dest(filePath.images.dest_dir))
});

gulp.task('data', function() {
  gulp.src(filePath.data.src)
    .pipe(changed(filePath.data.dest_dir))
    .pipe(gulp.dest(filePath.data.dest_dir));
});

gulp.task('html', function() {
  gulp.src(filePath.html.src)
    .pipe(changed(filePath.html.dest_dir))
    .pipe(gulp.dest(filePath.html.dest_dir));
});

gulp.task('coffee', function() {
  gulp.src(filePath.coffee.src)
    .pipe(changed(filePath.coffee.dest_dir, { extension: '.js' }))
    .pipe(gulp.dest(filePath.coffee.dest_dir))
    .pipe(size())
    .pipe(coffee({ bare: true, sourceMap: true, sourceFiles: './app' }).on('error', gutil.log))
    .pipe(gulp.dest(filePath.coffee.dest_dir));
});

gulp.task('sass', function() {
  gulp.src(filePath.sass.src)
    .pipe(changed(filePath.sass.dest_dir, { extension: '.css' }))
    .pipe(size())
    .pipe(sass())
    .pipe(gulp.dest(filePath.sass.dest_dir));
});

gulp.task('watch-html', function() {
  console.log("Watching: " + filePath.html.src);
  gulp.watch(filePath.html.src, ['html']);
  gulp.watch(filePath.html.dest).on('change', function(file) {
    console.log("Changed HTML: " + file.path);
    server.changed(file.path); 
  });
});

gulp.task('watch-images', function() {
  console.log("Watching: " + filePath.images.src);
  gulp.watch(filePath.images.src, ['images']);
  gulp.watch(filePath.images.dest).on('change', function(file) {
    console.log("Changed HTML: " + file.path);
    server.changed(file.path); 
  });
});

gulp.task('watch-coffee', function() {
  gulp.watch(filePath.coffee.src, ['coffee']);
  gulp.watch(filePath.coffee.dest).on('change', function(file) {
    server.changed(file.path);
  });
});

gulp.task('watch-sass', function() {
  gulp.watch(filePath.sass.src, ['sass']);
  gulp.watch(filePath.sass.dest).on('change', function(file) {
    console.log("Changed sass: " + file.path);
    server.changed(file.path); 
  });
});

gulp.task('watch-unit', function() {
  return gulp.src(filePath.unit.src)
    .pipe(karma({
      configFile: './spec/config/karma-unit.conf.js',
      action: 'watch'
    }));
});

gulp.task('build', ['lint', 'coffee', 'vendor', 'sass', 'images', 'html', 'data']);
gulp.task('watch', ['livereload', 'watch-sass', 'watch-coffee', 'watch-html', 'watch-images', 'watch-unit']);
gulp.task('default', ['watch']);