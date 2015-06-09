var gulp = require('gulp');

var fs = require('fs');
var dataPrepare = require('magika-data-prepare');

var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');

var path = {
	CSS_IN: './scss/main.scss',
	CSS_OUT: './public/css',
	JS_OUT_NAME: 'main.js',
	JS_OUT_DEST: './public/js',
	JS_IN: './jsx/main.jsx'
};

gulp.task('default', ['watch', 'data']);

gulp.task('watch', function() {
	gulp.watch(path.CSS_IN, ['sass'])

	var watcher = watchify(browserify({
		entries: [path.JS_IN],
		transform: [reactify],
		debug: true,
		cache: {}, packageCache: {}, fullPaths: true
	}));

	return watcher.on('update', function () {
		watcher.bundle()
			.pipe(source(path.JS_OUT_NAME))
			//.pipe(streamify(uglify(path.JS_OUT_NAME)))
			.pipe(gulp.dest(path.JS_OUT_DEST))
			console.log('Updated');
	})
	.bundle()
	.pipe(source(path.JS_OUT_NAME))
	//.pipe(streamify(uglify(path.JS_OUT_NAME)))
	.pipe(gulp.dest(path.JS_OUT_DEST));
});

gulp.task('sass', function () {
	gulp.src(path.CSS_IN)
		.pipe(plumber())
		.pipe(sass())
		.pipe(minifyCSS())
		.pipe(gulp.dest(path.CSS_OUT))
});

gulp.task('data', function() {
	fs.writeFile('./public/data/data-spells.json', dataPrepare.web('./data_source/Spells'));
	fs.writeFile('./data_node/data-spells.json', dataPrepare.node('./data_source/Spells'));
});