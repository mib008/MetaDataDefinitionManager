    //引入gulp  
var gulp = require('gulp'),
    path = require('path'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    gulpCss = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    streamify = require('gulp-streamify'),
    browserify = require('browserify'), 
    source = require('vinyl-source-stream');  // Bundles JS.

var BASE_PATH = "./dist";

gulp.task('clean', function (cb) {
    gulp.src([path.join(BASE_PATH)], { read: false })
        .pipe(clean({ force: true }));
    
    cb();
});

gulp.task('copyTask', ['clean'], function (cb) {
    gulp.src([
        "bower_components/metro/build/fonts/*.*"
    ]).pipe(gulp.dest(path.join(BASE_PATH, "lib/fonts")));    

    gulp.src([
        "src/**/*.html"
    ]).pipe(gulp.dest(path.join(BASE_PATH)));
    
    cb();
});

gulp.task('js', ['copyTask'], function (cb) {
    var loginJsLib = [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/angular/angular.min.js",
        "bower_components/metro/build/js/metro.min.js"
    ];
    
    gulp.src(loginJsLib)
        .pipe(concat("bower_components_login.js"))//合并 
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.join(BASE_PATH, "lib")));          //输出保存  
    
    var jsLib = [
        "bower_components/jquery/dist/jquery.min.js",
        "bower_components/angular/angular.min.js",
        "bower_components/angular-route/angular-route.min.js",
        "bower_components/angular-smart-table/dist/smart-table.min.js",
        "bower_components/metro/build/js/metro.min.js",
        "bower_components/datatables.net/js/jquery.dataTables.min.js",
        "bower_components/select2-4.0.2/dist/js/select2.full.min.js"
    ];
    
    gulp.src(jsLib)
        .pipe(concat("bower_components.js"))//合并 
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.join(BASE_PATH, "lib")));          //输出保存  
    
    // Browserify/bundle the JS.
    browserify(['src/script/app.js'])
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(path.join(BASE_PATH)))
        .pipe(rename({ suffix: '.min' }))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(path.join(BASE_PATH)));

    cb();
});

gulp.task('css', ['js'], function () {
    //var fontFiles = [
    //    "../../../bower_components/bootstrap/fonts/*.*",
    //];
    
    //gulp.src(fontFiles)
    //    .pipe(gulp.dest(path.join(BASE_PATH, "fonts")));
    var componentCss = [
        "bower_components/metro/build/css/metro.min.css",
        "bower_components/metro/build/css/metro-icons.min.css",
        "bower_components/metro/build/css/metro-responsive.min.css",
        "bower_components/metro/build/css/metro-rtl.min.css"
    ];
    
    gulp.src(componentCss)
        .pipe(concat("bower_components_style.css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(path.join(BASE_PATH, "lib/style")));
    
    
    var commonCss = [
        "src/style/common.css"
    ];
    
    gulp.src(commonCss)
        .pipe(concat("common.css"))
        .pipe(gulp.dest(path.join(BASE_PATH, "style")))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpCss())
        .pipe(gulp.dest(path.join(BASE_PATH, "style")));
});

gulp.task('default', ['copyTask', 'js', 'css']);