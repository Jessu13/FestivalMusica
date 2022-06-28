const { src, dest, watch,parallel} = require('gulp');

//CSS
const sass = require("gulp-sass")(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

//Dependencias de imágenes
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp');

function css( done ) {

    src('src/scss/**/*.scss') //Identificar el archivo de SASS
        .pipe(sourcemaps.init())
        .pipe ( plumber() )
        .pipe( sass() )   //Compilarlo
        .pipe(postcss([autoprefixer(),cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest("build/css")) //Guardarlo en el disco duro


    done(); //Callback que avisa a gulp cuando llegamos al final 
}

function imagenes (done) {

    const opciones = {
        optimizationLevel:3
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionWebp (done){

    const opciones = {
        quality:50
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done();
}

function javascript( done ){
    
    src('src/js/**/*.js')
        .pipe(dest('build/js'))

    done();
}

function dev( done ) {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascript)

    done();
}

exports.css = css;
exports.javascript = javascript;
exports.imagenes = imagenes
exports.versionWebp = versionWebp;
exports.dev = parallel(imagenes,versionWebp,javascript,dev);