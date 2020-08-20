const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const svgstore = require("gulp-svgstore");
const svgmin = require("gulp-svgmin");
const inject = require("gulp-inject");
const webp = require("gulp-webp");
const rename = require("gulp-rename");
const csso = require("gulp-csso");
const imagemin = require("gulp-imagemin");
const del = require("del");
const posthtml = require("gulp-posthtml");
const include = require("posthtml-include");

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

exports.reload = reload;

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(css));
  gulp.watch("source/*.html", gulp.series(html, sprite, reload));
  gulp.watch("source/js/**/*.js", gulp.series(js, reload));
}

exports.watcher = watcher;

// Clean

const clean = () => {
  return del("build/");
}

exports.clean = clean;

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/js/*.js"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

// Js-copy

const js = () => {
  return gulp.src([
    "source/js/*.js"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.js = js;

// CSS

const css = () => {
  return gulp.src("source/sass/style.scss")
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer()
  ]))
  .pipe(csso())
  .pipe(rename({
    suffix: ".min"
  }))
  .pipe(sourcemap.write("."))
  .pipe(gulp.dest("build/css"))
  .pipe(sync.stream());
}

exports.css = css;

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(posthtml([
      include()
    ]))
    .pipe(gulp.dest("build/"));
}

exports.html = html;

// SVG sprite

const sprite = () => {
  let svgs = gulp.src("source/img/contacts-*.svg")
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(svgmin({
    plugins: [{
        removeStyleElement: true
      },
      {
        removeAttrs: {
          attrs: [
            "fill",
            "class",
            "stroke"
          ]
        }
      }
    ]
  }));

  let fileContents = (filePath, file) => file.contents.toString();

  return gulp.src("build/*.html")
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest("build/"));
}

exports.sprite = sprite;

// Images min

const images = () => {
  return gulp.src("source/img/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({
      optimizationLevel: 3
    }),
    imagemin.mozjpeg({
      progressive: true
    }),
    imagemin.svgo(),
  ]))
  .pipe(gulp.dest("build/img"));
}

exports.images = images;

// From png, jpg to webp

const webpConv = () => {
  return gulp.src("source/img/*.{png,jpg}")
  .pipe(webp())
  .pipe(gulp.dest("build/img"));
}

exports.webp = webpConv;

const build = gulp.series(
  clean, copy, html, sprite, css, images, webpConv
);

exports.build = build;

exports.default = gulp.series(
  build, server, watcher
);
