var gulp = require('gulp');

var fs = require('fs');
var dataPrepare = require('./source/data_prepare');

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
	CSS_IN: './source/scss/main.scss',
	CSS_OUT: './build/css',
	JS_OUT_NAME: 'main.js',
	JS_OUT_DEST: './build/js',
	JS_IN: './source/jsx/main.jsx'
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
	fs.writeFileSync('./build/data/data-spellbook.json', dataPrepare('./source/data_source/Spells'));
	fs.writeFileSync('./build/data/data-bestiary.json', dataPrepare('./source/data_source/Bestiary'));
	fs.writeFileSync('./build/data/data-classes.json', dataPrepare('./source/data_source/Character Files', 'classes'));
});