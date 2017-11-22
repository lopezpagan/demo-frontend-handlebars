/**
 * Import plugins
 */
var gulp = require('gulp');
var livereload = require('gulp-livereload');
var uglify = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var pngquant = require('imagemin-pngquant');
var webserver = require('gulp-webserver');

/**
 * Handlebars Templating
 */
var hdb = require('handlebars');
var data = require('./src/handlebars/hdbData');   //json data
//var debug = require('./src/handlebars/hdbDebug'); //debug data

var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

/* Service Worker sw-precache */
var path = require('path');
var swPrecache = require('sw-precache');
const root = '/';
/**
 * Global variables
 */
var src = './src/';
var dest = './dist/';

gulp.task('imagemin', function() {
    return gulp.src(src+'assets/img/*')
        .pipe(imagemin({
            progressive: true, 
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dest+'assets/img'));
});

gulp.task('htmlmin', function() {
  return gulp.src(src+'**/*.html')
            .pipe(htmlmin({collapseWhitespace: false}))
            .pipe(gulp.dest(dest))
            .pipe(livereload());
});

gulp.task("jsonimp", function() {
    console.log('***** NEW DATA AVAILABLE *****');
    console.log(data.cards);
    console.log(data.lists);
    
    return gulp.src(src + 'handlebars/*.js')
               .pipe(gulp.dest(dest))
               .pipe(livereload());
});

gulp.task("jsimp", function() {
    return gulp.src(src + 'lib/**/*.js')
               .pipe(uglify('app.js'))
               .pipe(gulp.dest(dest+'assets/js'))
               .pipe(livereload());
});

gulp.task('sass', function() {
    gulp.src(src+'sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest+'assets/css'))
        .pipe(livereload());
});

gulp.task('uglify', function() {
    gulp.src([src + 'lib/**/*.js', src+'assets/js/**/*.js'])
        .pipe(uglify('app.js'))
        .pipe(gulp.dest(dest+'assets/js'))
        .pipe(livereload());
});

gulp.task('generate-service-worker', callback => {
  swPrecache.write(path.join(dest, 'sw.js'), {
    staticFileGlobs: [
      // track and cache all files that match this pattern
      dest + '**/*.{js,html,css,png,jpg,gif,json}'
    ],
    stripPrefix: dest
  }, callback);
});

gulp.task('livereload', function() {
    return gulp.pipe(livereload());
});

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      port: 3000,
      livereload: true,
      directoryListing: false,
      open: true
    }));
});

gulp.task('watch', function() {
    livereload.listen();

    gulp.watch(src+'**/*.html', ['htmlmin']);
    gulp.watch(src+'**/*.handlebars', ['handlebars']);
    gulp.watch(src+'handlebars/*.js', ['jsonimp']);
    //gulp.watch(src+'lib/**/*.js', ['jsimp']);
    gulp.watch(src+'sass/**/*.scss', ['sass']);
    gulp.watch(src+'assets/js/**/*.js', ['uglify']);
    gulp.watch(src+'assets/img/**/*', ['imagemin']);
    gulp.watch(src + 'sw.js', ['generate-service-worker']);
    
    gulp.watch([src+'assets/css/style.css', src+'assets/js/*.js', src+'lib/**/*.js', src+'assets/img/**/*', src+'handlebars/*.js', src+'**/*.handlebars'],
    function(files) {
        livereload.changed(files)
    });
               
});

gulp.task('handlebars', function () {   
    var options = require('./src/handlebars/hdbOptions');
        //data = require('./src/handlebars/hdbData');   //json data
    
    var templateData = {
        pageTitle: 'Page Title',
        cards: data.cards,
        lists: data.lists
    }
 
    return gulp.src(src+'templates/*.handlebars')
        .pipe(handlebars(templateData, options))
        .pipe(rename({ 
            /*dirname: 'dest',
            basename: '',
            prefix: 'pre-',
            suffix: '-suf',*/
            extname: '.html'
        }))
        .pipe(gulp.dest(dest))
        .pipe(livereload());
});
    
gulp.task('default', ['watch', 'webserver', 'handlebars']);
