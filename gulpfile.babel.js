import gulp from "gulp";
import path from "path";
import paths from "vinyl-paths";
import del from "del";
import run from "run-sequence";
import jasmine from "gulp-jasmine";
import reporters from "jasmine-reporters";
import typescript from "typescript";
import typings from "gulp-typings";
import gts from "gulp-typescript";
import sass from "gulp-sass";
import merge from "merge2";
import tsconfig from "./tsconfig.json";
import pkconfig from "./package.json";

const sassOptions = {
    importer: url => ({ file: url.startsWith("~") ? path.resolve("node_modules", url.substr(1)) : url })
};
const typingsConfig = "src/typings.json";
const typescriptSources = [ tsconfig.compilerOptions.rootDir + "/**/*.ts" ];
const htmlSources = [ tsconfig.compilerOptions.rootDir + "/**/*.html" ];
const scssSources = [ tsconfig.compilerOptions.rootDir + "/**/*.scss" ];
const output = tsconfig.compilerOptions.outDir;
const testSuites = [ "dist/test/**/*.js" ];
const clean = [ output ];

const tsc = gts(Object.assign({ typescript: typescript }, tsconfig.compilerOptions));

gulp.task("clean", done => gulp.src(clean).pipe(paths(del)));
gulp.task("typings", done => gulp.src(typingsConfig).pipe(typings()));
gulp.task("build-typescript", [ "typings" ], done => {
    let stream = gulp.src(typescriptSources).pipe(tsc);
    return merge([
        stream.js.pipe(gulp.dest(output)),
        stream.dts.pipe(gulp.dest(output))
    ]);
});
gulp.task("build-scss", done => gulp.src(scssSources).pipe(sass(sassOptions)).pipe(gulp.dest(output)));
gulp.task("build-html", done => gulp.src(htmlSources).pipe(gulp.dest(output)));
gulp.task("build", done => run("clean", [ "build-typescript", "build-scss", "build-html" ], done));
gulp.task("test", [ "build" ], done => gulp.src(testSuites).pipe(jasmine()));
gulp.task("default", [ "test" ]);
