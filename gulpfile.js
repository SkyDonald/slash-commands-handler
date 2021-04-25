const del = require('del');
const gulp = require('gulp');
const esbuild = require('gulp-esbuild');
const { exec } = require('child_process');

function clean () {
  del(['dist/**/*']);
  return exec('yarn run format');
}

function build () {
  return gulp.src('src/**/*.ts')
    .pipe(esbuild({
      sourcemap: false,
      format: 'cjs',
      target: 'node12',
      loader: {
        '.ts': 'ts'
      }
    }))
    .pipe(gulp.dest('dist'));
}

function watch (cb) {
  exec('nodemon .', cb);
  gulp.watch('src/**/*.ts', { delay: 500 }, gulp.series(clean, build));
}

exports.build = gulp.series(clean, build);
exports.watch = gulp.series(clean, build, watch);
