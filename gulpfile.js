const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const fs = require("fs");
const { fork } = require('child_process');
const path = require("path");
const yaml = require('js-yaml');
const _ = require("lodash");

const envConfig = yaml.load(fs.readFileSync("env-config.yaml"));

const distDir = "./dist";
const srcDir = "./src";
const espReadyBundleFileName = "bundle.js";
const espReadyBundlePath = path.join(distDir, espReadyBundleFileName);
const appFileName = "index.js";
const appFilePath = path.join(distDir, appFileName);

const espConsoleBeingWatchedFileName = "esp-console-input.js";
const espConsoleBeingWatchedFilePath = path.join(distDir, espConsoleBeingWatchedFileName);

gulp.task("content-to-dist", gulp.series(() => {
    return gulp
        .src("src/**/*.js", { base: 'src' })
        .pipe(gulp.dest(distDir));
}));

gulp.task("send-to-espurino-console", gulp.series((cb) => {
    const content = fs.readFileSync(espReadyBundlePath);
    fs.writeFile(
        espConsoleBeingWatchedFilePath,
        content,
        (err) => {
            if (err) { throw err; }
            cb();
        });
}));

gulp.task("clear-espurino-watch-file", gulp.series((cb) => {
    fs.writeFile(
        espConsoleBeingWatchedFilePath,
        "",
        (err) => {
            if (err) { throw err; }
            cb();
        });
}));

gulp.task("espruino-console", gulp.series('clear-espurino-watch-file', (cb) => {
    const buildproc = fork(
        require.resolve("espruino/bin/espruino-cli"),
        ["--board", envConfig.board, "-b", envConfig.port_speed, "--port", envConfig.port, "-w", espConsoleBeingWatchedFileName],
        { cwd: distDir });
    buildproc.on('close', (code) => {
        cb();
    });
}));

gulp.task("compile-ts", gulp.series(function () {
    const tsResult = tsProject.src().pipe(tsProject());
    return tsResult.js.pipe(gulp.dest(distDir));
}));

gulp.task("prepare-for-espruino", gulp.series(['compile-ts', 'content-to-dist'], (cb) => {
    if (!fs.existsSync(appFilePath)) {
        cb("main app file does not exit " + appFilePath);
        return;
    }

    let appContent = fs.readFileSync(appFilePath).toString();
    appContent = appContent.replace('Object.defineProperty(exports, "__esModule", { value: true });', "");
    fs.writeFileSync(appFilePath, appContent);

    const buildproc = fork(
        require.resolve("espruino/bin/espruino-cli"),
        ["--board", envConfig.board, appFileName, "-o", espReadyBundleFileName],
        { cwd: distDir });
    buildproc.on('close', (code) => {
        cb();
    });
}));

gulp.task("build", gulp.series('prepare-for-espruino'));