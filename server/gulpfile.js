const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.task("default", () => {
  gulp
    .src(__dirname + "/src/**/*.js")
    .pipe(
      babel({ presets: [["env", { targets: { node: 8 }, useBuiltIns: true }]] })
    )
    .pipe(gulp.dest(__dirname + "/dist"));
});

gulp.task("watch", () => {
  gulp.watch(__dirname + "/dist", ["default"]);
});
