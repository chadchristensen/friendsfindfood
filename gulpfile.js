'use strict';

const gulp       = require('gulp');
const sass       = require('gulp-sass');
const concat     = require('gulp-concat');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const maps       = require('gulp-sourcemaps');
const del        = require('del');
const livereload = require('gulp-livereload');
const imagemin   = require('gulp-imagemin');
const cssnano     = require('gulp-cssnano');
const strip      = require('gulp-strip-comments');

const config = {
  bootstrapDir: './bower_components/bootstrap-sass',
  publicDir: './public',
};

gulp.task("concatScripts", function() {
  return gulp.src([`./js/vendor/modernizr-2.8.3.min.js`,
             `./js/vendor/jquery-1.11.3.min.js`,
             `./js/vendor/bootstrap.min.js`,
             `./js/main.js`
             ])
    .pipe(maps.init())
    .pipe(concat("app.js"))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(`${config.publicDir}/js`));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(`${config.publicDir}/js`))
});

// Image Task
// Compress
gulp.task('image', function() {
  gulp.src('img/*')
    .pipe(imagemin())
    .pipe(gulp.dest(`${config.publicDir}/img`))
});

gulp.task('icons', function() {
  return gulp.src('./bower_components/font-awesome/fonts/**.*')
    .pipe(gulp.dest('./public/fonts'));
});

gulp.task('css', function() {
  return gulp.src('./sass/style.scss')
  .pipe(maps.init())
  .pipe(sass({
    includePaths: [`${config.bootstrapDir}/assets/stylesheets`,
    './bower_components/font-awesome/scss'],
  }))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(`${config.publicDir}/css`))
});

gulp.task('fonts', function() {
  return gulp.src(`${config.bootstrapDir}/assets/fonts/**/*`)
  .pipe(gulp.dest(`${config.publicDir}/fonts`));
});

gulp.task('watchFiles', function() {
  livereload.listen({start: true});
  gulp.watch(['./sass/*.scss'], ['css']);
  // gulp.watch([''])
});

gulp.task('minifyCSS', ['css'], function() {
  return gulp.src(`${config.publicDir}/css/style.css`)
    .pipe(cssnano())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(`${config.publicDir}/css`));
});

gulp.task('clean', function() {
  del([`${config.publicDir}/css`, `${config.publicDir}/js/app.*`]);
});
gulp.task("build", ['minifyScripts', 'minifyCSS']);

gulp.task('default', ['clean'], function() {
  gulp.start('build');
  gulp.start('icons');
  gulp.start('fonts');
});
