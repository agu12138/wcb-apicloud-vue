const gulp = require('gulp');
const {
  spawn
} = require('child_process');
gulp.task('wcb', function () {
    // 将你的默认的任务代码放在这
  var isCopy=false;
    var watcher = gulp.watch('src/**/**');
    watcher.on('change', function (event) {
      if (!isCopy) { 
         isCopy = true;
         console.log("重新打包中");
         const child = spawn('webpack --config ./config/webpack.config.js', {
           stdio: 'inherit',
           shell: true
         });
         child.on('exit', (code, signal) => {
           console.log("重新打包完成");
           console.log("监听文件中");
            isCopy = false;
         });
      }

    });
});