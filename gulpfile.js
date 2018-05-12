const gulp = require('gulp');
const copy = require('gulp-copy');

gulp.task('build-electron-app', function () {
  return gulp
    //todo clean dist-electron/ except node_modules
    .src(['dist/*', 'index.js', 'index.html', 'package.json', 'src/electron/store.electron.js', 'src/electron/toaster.electron.js', 'src/store.default.js'])
    .pipe(copy('dist-electron/'));
});
