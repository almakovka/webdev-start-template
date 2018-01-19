import configFile from './config';
import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import yargs         from 'yargs';
import browser       from 'browser-sync';
import autoprefixer  from 'autoprefixer';
import cssvars       from 'postcss-simple-vars';
import nested        from 'postcss-nested';
import cssImport     from 'postcss-import';
import mixins        from 'postcss-mixins';
import hexrgba       from 'postcss-hexrgba';
import cssnano       from 'cssnano';
import del           from 'del';
import panini        from 'panini';
import webpackStream from 'webpack-stream';
import webpack3      from 'webpack';
import named         from 'vinyl-named';

// Load settings from config file
const { PORT, PATHS, webpackConfig } = configFile;

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
 gulp.series(clean, gulp.parallel(pages, styles, javascript, images, copy)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  return del(PATHS.dist, done);
}

// Copy files out of the src folder
// This task skips over the "img", "js", and "css" folders, which are parsed separately
function copy() {
  return gulp.src(PATHS.srcFiles)
    .pipe(gulp.dest(PATHS.dist));
}

// Copy page templates into finished HTML files
function pages() {
  return gulp.src('src/pages/**/*.{html,hbs,handlebars}')
    .pipe(panini({
      root: 'src/pages/',
      layouts: 'src/layouts/',
      partials: 'src/partials/',
      data: 'src/data/',
      helpers: 'src/helpers/'
    }))
    .pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
  panini.refresh();
  done();
}

// Processing CSS files
// In production, the CSS is compressed
function styles() {
  return gulp.src('src/assets/css/styles.css')
    .pipe($.sourcemaps.init())
    .pipe($.postcss([cssImport , mixins, cssvars, nested, hexrgba, autoprefixer]))
    .on('error', function(errorInfo) {
      console.log(errorInfo);
      this.emit('end');
    })
    .pipe($.if(PRODUCTION, $.postcss([cssnano])))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/css'))
}

// Combine JavaScript into one file
// In production, the file is minified
function javascript() {
  return gulp.src(PATHS.entries)
    .pipe(named())
    .pipe($.sourcemaps.init())
    .pipe(webpackStream(webpackConfig, webpack3))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/assets/js'));
}

// Copy images to the "dist" folder
// In production, the images are compressed
function images() {
  return gulp.src('src/assets/img/**/*')
    .pipe($.if(PRODUCTION, $.imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    })))
    .pipe(gulp.dest(PATHS.dist + '/assets/img'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
    server: PATHS.dist, 
    port: PORT
  }, done);
}

// Reload the browser with BrowserSync
function reload(done) {
  browser.reload();
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.srcFiles, gulp.series(copy, reload));
  gulp.watch('src/pages/**/*.html', gulp.series(pages, reload));
  gulp.watch('src/{layouts,partials}/**/*.html', gulp.series(resetPages, pages, reload));
  gulp.watch('src/assets/css/**/*.css', gulp.series(styles, reload));
  gulp.watch('src/assets/js/**/*.js', gulp.series(javascript, reload));
  gulp.watch('src/assets/img/**/*', gulp.series(images, reload));
}
