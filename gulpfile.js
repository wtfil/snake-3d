var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var server = require('http-server');

var files = {
    src: './public/index.js',
    dest: {
        name: '_index.js',
        root: './public'
    }
};

gulp.task('server', function (cb) {
	var port = process.env.NODE_PORT || 3000;
	server.createServer().listen(port, cb);
	gutil.log('Server started at ' + gutil.colors.green('http://127.0.0.1:' + port));
});

gulp.task('watch', function () {
    var args = watchify.args;
    args.degub = true;
    var bundler = watchify(browserify(files.src, args));

    bundler.transform('brfs');
    bundler.on('update', rebundle);

    function onError(e) {
        gutil.log(gutil.colors.red(e.message));
    }

    function rebundle() {
        var start = Date.now();

        return bundler.bundle()
          .on('error', onError)
          .pipe(source(files.dest.name))
          .pipe(gulp.dest(files.dest.root))
          .on('end', function () {
              var time = Date.now() - start;
              gutil.log('Building \'' + gutil.colors.green(files.src) + '\' in ' + gutil.colors.magenta(time + ' ms'));
          });
    }

    rebundle();

});

gulp.task('dev', ['server', 'watch']);
