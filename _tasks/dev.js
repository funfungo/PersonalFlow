const gulp = require('gulp'),
      del = require('del'),
      less = require('gulp-less')
      babel = require('gulp-babel'),
      util = require('gulp-util'),
      path = require('path');


const paths = {
    copy: {
        src: ['src/html/**/*.html', 'src/img/**/*.*', 'src/media/**/*.*', 'src/js/**/*.js', 'src/iframes/**/*.*', 'src/font/**/*.*'],
    },
    less: {
        src: ['src/css/**/*.less','src/css/**/*.css']
    },
    es6: {
        src: 'src/js/**/*.es6'
    }
};

function clean() {
    // You can use multiple globbing patterns as you would with `gulp.src`,
    // for example if you are using del 2.0 or above, return its promise
    return del(['dev']);
}
//编译less
function compileLess() {
    let source = paths.less.src;
    return gulp.src(source, {
            base: 'src'
        })
        .pipe(less())
        .pipe(gulp.dest('dev'));
}
//复制文件
function copyFile(file) {
    let source = typeof(file) === 'function' ? paths.copy.src : file;
    return gulp.src(source, {
        base: 'src'
    })
        .pipe(gulp.dest('dev'));
}

function watch(cb) {
    var watcher = gulp.watch([
        paths.copy.src,
        paths.less.src,
        paths.es6.src
    ]);

    watcher.on('change', function (file) {
        util.log(file + ' has been changed');
        watchHandler('changed', file);
    })
    .on('add', function (file) {
        util.log(file + ' has been added');
        watchHandler('add', file);
    })
    .on('unlink', function (file) {
        util.log(file + ' has been deleted');
        watchHandler('delete', file);
    })
}

function watchHandler(type, file) {
    let target = file.match(/^src[\/|\\](.*?)[\/|\\]/)[1];
    if(type === 'delete'){
        deleteFile(file);
    }else{
        switch (target) {
            case 'css':
                compileLess();
                break;
            default:
                copyFile(file);

        }
    }
}
function deleteFile(file) {
    let target = file.replace('src/','dev/').replace('.less','.css').replace('.es6','.js');
    del([target]);
}

//TODO 将.es6文件编译为js
function compileJs() {
    return gulp.src(paths.es6.src)
        .pipe(babel({ presets: ['env'] }))
        .pipe(gulp.dest(paths.es6.dest));
}

gulp.task('dev', gulp.series(clean, gulp.parallel(copyFile, compileLess)));
gulp.task('dev-w', gulp.series(clean, gulp.parallel(copyFile, compileLess),watch));
