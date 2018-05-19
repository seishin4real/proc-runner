const gulp = require('gulp');
const copy = require('gulp-copy');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('prepare-app-sources', function () {
  del.sync([
    'dist-electron/dist',
    'dist-electron/src',
    'dist-electron/index.*'
  ]);
  return gulp
    .src([
      'dist/*',
      'index.js',
      'index.html',
      'package.json',
      'src/electron/store.electron.js',
      'src/electron/toaster.electron.js',
      'src/electron/toaster.html',
      'src/electron/toaster.client.js',
      'src/store.default.js'
    ])
    .pipe(copy('dist-electron/'));
});


gulp.task('init-app-sources', function () {
  return gulp.src('package.electron.json')
    .pipe(rename('package.json'))
    .pipe(gulp.dest('dist-electron/'));
})
