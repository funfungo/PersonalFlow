const gulp = require('gulp');
const GulpSSH = require('gulp-ssh');
const path = require('path');

const config = {
    host: '119.29.26.199',
    username: 'nikki',
    password: 'bah@Moo5bi',
    remoteDir: 'www/'
  };


const gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: config
})

function upload() {
    let projectName = path.basename(process.cwd());
    return gulp.src('dev/**',{base:'dev'})
    .pipe(gulpSSH.dest(config.remoteDir+projectName))
}

gulp.task('preview', gulp.series('dev',upload));
