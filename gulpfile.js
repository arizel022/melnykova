//consts
const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const flatten = require('gulp-flatten');
const ignore = require('gulp-ignore');
const fs = require('fs');



const data = require('gulp-data');

//--------------------------------------------Build - Start
const gulp = require('gulp');
const clean = require('gulp-clean');
const path = require('path');
const htmlreplace = require('gulp-html-replace');
const replace = require('gulp-replace');

//clean build
gulp.task('clean', () => {
    return gulp.src('build', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
});
// copy images, css, js, exclude app/html
gulp.task('copy', () => {
    return gulp.src(['app/images/**/*', 'app/css/**/*', 'app/js/**/*', '!app/html/**/*'], { base: 'app' }) // Исключаем папку html
        .pipe(gulp.dest('build'));
});
// replace ".html" in hrefs on ""
gulp.task('html', () => {
    return gulp.src('app/**/*.html')
        .pipe(replace('.html"', '"'))
        .pipe(htmlreplace({
            'removeHtmlExtension': {
                src: '',
                tpl: '<link rel="stylesheet" href="%s.css"><script src="%s.js"></script>'
            }
        }))
        .pipe(gulp.dest('build'));
});
// delete app/html from build
gulp.task('cleanHtmlFromBuild', () => {
    return gulp.src('build/html', { read: false, allowEmpty: true })
        .pipe(clean({ force: true }));
});
// run
gulp.task('build', gulp.series('clean', 'copy', 'html', 'cleanHtmlFromBuild'));
gulp.task('default', gulp.series('build'));
//--------------------------------------------Build - end


//tasks
function browsersync() {
    browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify: false
    })
}

function styles() {
    return src('app/scss/*.scss')
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],
            grid: true
        }))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/slick-carousel/slick/slick.js',
        'node_modules/mixitup/dist/mixitup.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/swup/dist/Swup.umd.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}



function compileHtml(srcPath, destPath) {
    return src(srcPath)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(replaceVariablesInStream())
        .pipe(dest(destPath))
        .pipe(browserSync.stream());
}
function htmlInclude() {
    return compileHtml(
        'app/html/pages/*.html',
        'app'
    );
}
function htmlIncludeBlog() {
    return compileHtml(
        'app/html/pages/articles/*.html',
        'app/articles'
    );
}
function htmlIncludeExhs() {
    return compileHtml(
        'app/html/pages/exhibitions/*.html',
        'app/exhibitions'
    );
}
function htmlIncludeBookstore() {
    return compileHtml(
        'app/html/pages/bookstore/*.html',
        'app/bookstore'
    );
}
function htmlIncludeCourses() {
    return compileHtml(
        'app/html/pages/courses/*.html',
        'app/courses'
    );
}
function htmlIncludeAuthors() {
    return compileHtml(
        'app/html/pages/authors/*.html',
        'app/authors'
    );
}


// Переменная для хранения общих данных (будет обновляться)
let globalData = {};
const globalDataPath = path.join(__dirname, 'app/data/data.json');

// Функция для загрузки данных из data.json
function loadGlobalData() {
    try {
        if (fs.existsSync(globalDataPath)) {
            const jsonContent = fs.readFileSync(globalDataPath, 'utf8');

            globalData = JSON.parse(jsonContent);

            console.log(`Данные из ${globalDataPath} успешно обновлены.`);
        } else {
            console.warn(`Файл данных ${globalDataPath} не найден. Переменные могут не подставиться.`);
            globalData = {};
        }
    } catch (e) {
        console.error(`Ошибка при загрузке ${globalDataPath}:`, e);
        globalData = {};
    }
}
loadGlobalData();

function replaceVariablesInStream() {
    loadGlobalData();

    return replace(/\{([^}]+)\}/g, function (match, p1) {
        const keys = p1.split('.');
        let currentValue = globalData;

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];

            if (
                currentValue &&
                typeof currentValue === 'object' &&
                currentValue.hasOwnProperty(key)
            ) {
                currentValue = currentValue[key];
            } else {
                console.warn(`Переменная "${p1}" не найдена в ${globalDataPath}`);
                return match;
            }
        }

        return currentValue;
    });
}


function watching() {
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    watch(['app/html/pages/*.html'], htmlInclude);
    watch(['app/html/pages/articles/*.html'], htmlIncludeBlog);
    watch(['app/html/pages/exhibitions/*.html'], htmlIncludeExhs);
    watch(['app/html/pages/bookstore/*.html'], htmlIncludeBookstore);
    watch(['app/html/pages/courses/*.html'], htmlIncludeCourses);
    watch(['app/html/pages/authors/*.html'], htmlIncludeAuthors);

    watch(
        ['app/html/lego/**/*.html', 'app/data/**/*.json'],
        series(
            htmlInclude,
            htmlIncludeBlog,
            htmlIncludeExhs,
            htmlIncludeBookstore,
            htmlIncludeCourses,
            htmlIncludeAuthors
        )
    );
}


//calls
exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.htmlInclude = htmlInclude;
exports.htmlIncludeBlog = htmlIncludeBlog;
exports.htmlIncludeExhs = htmlIncludeExhs;
exports.htmlIncludeBookstore = htmlIncludeBookstore;
exports.htmlIncludeCourses = htmlIncludeCourses;
exports.htmlIncludeAuthors = htmlIncludeAuthors;
exports.replaceVariablesInStream = replaceVariablesInStream;

exports.default = parallel(styles, scripts, browsersync, watching, htmlInclude, htmlIncludeBlog, htmlIncludeCourses, htmlIncludeExhs, htmlIncludeBookstore, htmlIncludeAuthors);



