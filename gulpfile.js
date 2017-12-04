/**
* @author  Tony López <tony@lopezpagan.com>
* @website lopezpagan.com
*/

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
var data = require('./src/dbs/hdbData');   //json data
//var debug = require('./src/dbs/hdbDebug'); //debug data

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


/**
 * Image Optimization
 */
gulp.task('imagemin', function() {
    return gulp.src(src+'assets/img/**/*')
        .pipe(imagemin({
            progressive: true, 
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(dest+'assets/img/'));
});

/**
 * Minify HTML
 */
gulp.task('htmlmin', function() {
  console.log('***** HTML MIN *****');
     
  return gulp.src(src+'*.html')
            .pipe(htmlmin({collapseWhitespace: false}))
            .pipe(gulp.dest(dest));
});

/**
 * Display Json Files
 */
gulp.task("dbs", function() {
    console.log('***** NEW DATA AVAILABLE *****');
    console.log(data.cards);
    console.log(data.lists);
});

/**
 * SASS to CSS
 */
gulp.task('sass', function() {
    console.log('***** SASS *****');
     
    return gulp.src(src+'sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(dest+'assets/css'));
     
});

/**
 * Minify JS
 */
gulp.task('uglify', function() {
    console.log('***** UGLIFY *****');
     
    return gulp.src([src + 'lib/**/*.js', src+'assets/js/**/*.js'])
        .pipe(uglify('app.js'))
        .pipe(gulp.dest(dest+'assets/js'));
});

/**
 * Copy and minify manifest.json (PWA)
 */
gulp.task('manifest', function() {
     console.log('***** MANIFEST *****');
     
     return gulp.src(src+'manifest.json')
            .pipe(htmlmin({collapseWhitespace: false}))
            .pipe(gulp.dest(dest));
});


/**
 * Generate Service Worker (PWA)
 */
gulp.task('generate-service-worker', callback => {
  console.log('***** GENERATE SERVICE WORKER *****');
     
  swPrecache.write(path.join(dest, 'sw.js'), {
    staticFileGlobs: [
      // track and cache all files that match this pattern
      dest + '**/*.{js,html,css,png,jpg,gif,json}'
    ],
    stripPrefix: dest
  }, callback);
});

/**
 * Handlebars Templating
 */
gulp.task('handlebars', function () { 
    console.log('***** COMPILE HANDLEBARS *****');
     
    var options = require(src+'dbs/hdbOptions');
    var helpers = require(src+'dbs/hdbHelpers');
        //data = require(src+''dbs/hdbData');   //json data
    
    var templateData = {
        cards: data.cards,
        lists: data.lists,
        pannels: data.pannels
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
        .pipe(gulp.dest(dest));
});

/**
 * Watch files
 */
gulp.task('watch', function() {     
    console.log('***** WATCH & LISTEN *****');
     
    livereload.listen();
     
    gulp.watch(src+'dbs/**/*.js', ['dbs']);
    gulp.watch(src+'**/*.handlebars', ['handlebars']);
    gulp.watch(src+'sass/**/*.scss', ['sass']);
    gulp.watch(src+'lib/**/*.js', ['uglify']);
    gulp.watch(src+'assets/js/**/*.js', ['uglify']);
    gulp.watch(src+'assets/img/**/*', ['imagemin']);
    //gulp.watch(src+'manifest.json', ['manifest']);
    gulp.watch([src+'*.html', src+'**/*.handlebars']/*, ['generate-service-worker']*/);
    gulp.watch(src+'*.html', ['htmlmin']);
    
    gulp.watch([dest+'assets/css/style.css', dest+'assets/js/app.js', dest+'sw.js', dest+'assets/img/**/*', dest+'manifest.json', dest+'*.html'],
    function(files) {
        livereload.changed(files)
    });
               
});

/**
 * Live Reload
 */
gulp.task('livereload', function() {
    console.log('***** LIVERELOAD *****');
     
    return gulp.pipe(livereload());
});

/**
 * Start Webserver
 */
gulp.task('webserver', function() {
  console.log('***** START WEBSERVER *****');
     
  gulp.src('dist')
    .pipe(webserver({
      host: 'localhost',
      port: 3000,
      livereload: true,
      directoryListing: false,
      open: true
    }));
});
    

/**
 * Default task
 */
gulp.task('default', ['dbs', 'handlebars', 'sass', 'uglify', 'imagemin', 'manifest', 'generate-service-worker', 'htmlmin']);
