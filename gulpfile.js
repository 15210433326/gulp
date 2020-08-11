var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');  //html压缩组件
var gulpRemoveHtml = require('gulp-remove-html');  //标签清除
var uglify = require('gulp-uglify');  //js文件压缩
var minifyCss = require('gulp-minify-css');  //压缩CSS为一行；
var removeEmptyLines = require('gulp-remove-empty-lines');  //清除空白行
var concat = require('gulp-concat');  //合并文件
var clean = require('gulp-clean');  // 清理文件插件
var rev = require('gulp-rev');  //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector');  //- 路径替换
var gulpSequence = require('gulp-sequence');  //队列方式执行任务
var browserSync = require('browser-sync').create();  // 创建browser-sync
//dist文件夹只删除 文件 不删除文件夹，防止删除掉.svn,根据项目动态调整文件后缀
var cleanFiles = ['dist/**/*.js', 'dist/**/*.css',
  'dist/**/*.jpg', 'dist/**/*.gif', 'dist/**/*.png',
  'dist/**/*.html', 'dist/**/*.mp4', 'rev/**/*.json', 'dist/**/*.md'];
var pathArr = __dirname.split("\\"); // 获取gulpfile.js的路径，转换为 localhost模式
var projectPath = 'localhost';
for (var i = pathArr.length - 4; i < pathArr.length; i++) {
  projectPath += '/' + pathArr[i];
}
gulp.task('css', function () {
  return gulp.src(['./css/*'])
    //.pipe(concat('index.css'))//合成到一个css 
    .pipe(minifyCss())//压缩css到一行
    .pipe(rev())
    //.pipe(concat('index.min.css'))//压缩后的css
    .pipe(gulp.dest('./dist/css'))//输出到css目录
    .pipe(rev.manifest()) 
    .pipe(gulp.dest('./rev/css'));
});


gulp.task('js', function () {
  return gulp.src(['./js/*'])
    //.pipe(concat('index.js'))//合成到一个js 
    .pipe(uglify())//压缩js到一行
    .pipe(rev())
    //.pipe(concat('index.min.js'))//压缩后的js
    .pipe(gulp.dest('./dist/js'))//输出到js目录
    .pipe(rev.manifest()) 
    .pipe(gulp.dest('./rev/js'));
});

gulp.task('images', function () {
  return gulp.src(['./images/*'])
    .pipe(rev())
    .pipe(gulp.dest('./dist/images'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('./rev/images'));
});


gulp.task('rev-css-images', function () {
  return gulp.src(['rev/**/*.json', './dist/css/*.css'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist/css'));
});


gulp.task('rev', function () {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  return gulp.src(['rev/**/*.json', './*.html'])
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulpRemoveHtml())//清除特定标签
    .pipe(removeEmptyLines({ removeComments: true }))//清除空白行
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist'))
})

gulp.task('move-libs', function () {
  return gulp.src('./libs/**')
    .pipe(gulp.dest('dist/libs'));
});

gulp.task('readme', function () {
  return gulp.src('./*.md')
    .pipe(gulp.dest('dist'));
});

// 静态服务器
gulp.task('browser-sync', function () {
  browserSync.init({
    browser: "chrome",
    proxy: projectPath,  //根据项目修改
  });
  // 监测文件变化，自动刷新页面
  gulp.watch(["*.shtml", "css/*.css", "js/*.js"]).on('change', browserSync.reload);

});

//清空目标文件夹缓存
gulp.task('clean', function () {
  //read参数为false表示不读取文件的内容
  return gulp.src(cleanFiles, { read: false })
    .pipe(clean());
});

gulp.task('default', gulpSequence('clean', 'css', 'js', 'images', 'rev-css-images', 'rev', 'move-libs', 'readme'));
