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

// Styles

const styles = () => {
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
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
}

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "source"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// localSprites

const localSprites = () => {
  let svgs = gulp.src("source/img/sprite-*.svg");

  let fileContents = (filePath, file) => file.contents.toString();

  return gulp.src("source/*.html")
  .pipe(inject(svgs, { transform: fileContents }))
  .pipe(gulp.dest("source/"));
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
}

exports.default = gulp.series(
  styles, localSprites, server, watcher
);

// Clean

const clean = () => {
  return del("build/");
}

exports.clean = clean

// Copy

const copy = () => {
  return gulp.src([
    "source/fonts/*.{woff,woff2}",
    "source/js/*.js",
    "source/*.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
}

exports.copy = copy;

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
  .pipe(gulp.dest("build/css"));
}

exports.css = css;

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

exports.build = gulp.series(
  clean, copy, sprite, css, images, webpConv
);
