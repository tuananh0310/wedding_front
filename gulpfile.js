// updated for Gulp 4 / Node 18+
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');
const glob = require('glob');

const $ = gulpLoadPlugins();

function imagesList(cb) {
  const files = glob.sync('app/images/**/*.{png,jpg,jpeg,gif,webp,svg}');
  const relative = files.map(f => f.replace(/^app\//, ''))
    .filter(f => {
      // Loại trừ các file không muốn thêm vào APP_IMAGES
      const excludedFiles = ['images/footer.png', 'images/cloud.png', 'images/miguel-miriam.png', 'images/confectionary.png'];
      // Loại trừ tất cả các file trong thư mục qr
      const isQRFolder = f.startsWith('images/qr/');
      return !excludedFiles.includes(f) && !isQRFolder;
    });
  const contents = `window.APP_IMAGES = ${JSON.stringify(relative, null, 2)};`;

  fs.mkdirSync('.tmp/scripts', {recursive: true});
  fs.writeFileSync('.tmp/scripts/images-list.js', contents);

  // also write to source so script is present even if .tmp isn't available yet
  fs.mkdirSync('app/scripts', {recursive: true});
  fs.writeFileSync('app/scripts/images-list.js', contents);
  cb();
}

function styles() {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.'],
      quietDeps: true, // silence deprecation noise from dependencies (e.g., bootstrap-sass)
      silenceDeprecations: ['legacy-js-api', 'import', 'if-function', 'global-builtin', 'color-functions', 'slash-div']
    }).on('error', sass.logError))
    .pipe($.autoprefixer({overrideBrowserslist: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel({presets: ['@babel/preset-env']}))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.tmp/scripts'))
    .pipe(browserSync.stream());
}

function lint() {
  return gulp.src('app/scripts/**/*.js')
    .pipe(browserSync.stream({once: true}))
    .pipe($.eslint({fix: true}))
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
    .pipe(gulp.dest('app/scripts'));
}

const fonts = () => gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function () {})
  .concat('app/fonts/**/*'))
  .pipe(gulp.dest('.tmp/fonts'))
  .pipe(gulp.dest('dist/fonts'));

const extras = () => gulp.src([
  'app/*.*',
  '!app/*.html',
  'app/manifest.json',
  'app/sw.js'
], {dot: true})
  .pipe(gulp.dest('dist'));

const images = () => gulp.src('app/images/**/*')
  .pipe($.imagemin({
    // Tối ưu JPEG - giảm chất lượng để giảm dung lượng đáng kể
    mozjpeg: {
      quality: 75, // Giảm từ 85 xuống 75 để tiết kiệm dung lượng (vẫn đủ tốt cho web)
      progressive: true
    },
    // Tối ưu PNG
    optipng: {
      optimizationLevel: 7,
      strip: true
    },
    // Tối ưu GIF
    gifsicle: {
      optimizationLevel: 3,
      colors: 256
    },
    // Tối ưu SVG
    svgo: {
      plugins: [
        {cleanupIDs: false},
        {removeViewBox: false},
        {removeUselessDefs: true},
        {removeEmptyAttrs: true},
        {removeHiddenElems: true}
      ]
    }
  }, {
    verbose: true
  }))
  .pipe(gulp.dest('dist/images'));

const music = () => {
  // Copy music files if they exist
  return gulp.src('app/music/**/*', {allowEmpty: true})
    .pipe(gulp.dest('.tmp/music'))
    .pipe(gulp.dest('dist/music'));
};

const wiredepTask = () => {
  gulp.src('app/styles/*.scss')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  return gulp.src('app/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
};

const html = gulp.series(imagesList, styles, scripts, () =>
  gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'))
);

const clean = () => del(['.tmp', 'dist']);

function serve(done) {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app'],
      routes: {
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/styles/**/*.scss', styles);
  gulp.watch('app/scripts/**/*.js', gulp.series(lint, scripts));
  gulp.watch('app/images/**/*', gulp.series(imagesList));
  gulp.watch('app/fonts/**/*', fonts);
  gulp.watch('app/music/**/*', music);
  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch('app/images/**/*').on('change', browserSync.reload);
  gulp.watch('.tmp/fonts/**/*').on('change', browserSync.reload);
  gulp.watch('bower.json', gulp.series(wiredepTask, fonts));

  done();
}

const measure = () => gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));

const build = gulp.series(
  clean,
  gulp.series(lint, gulp.parallel(html, images, fonts, extras, music)),
  measure
);

function serveDist(done) {
  browserSync.init({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist']
    }
  });
  done();
}

const deploy = gulp.series(build, () => gulp.src('dist/**/*').pipe($.ghPages()));

gulp.task('imagesList', imagesList);
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('lint', lint);
gulp.task('wiredep', wiredepTask);
gulp.task('music', music);
gulp.task('serve', gulp.series(imagesList, gulp.parallel(styles, scripts, fonts, music, wiredepTask), serve));
gulp.task('serve:dist', gulp.series(build, serveDist));
gulp.task('build', build);
gulp.task('default', build);
gulp.task('deploy', deploy);
