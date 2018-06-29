const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

let micrositeName = '';

function run(name, dir) {
  const tempDir = path.resolve(__dirname, '../template');
  const targetDir = path.resolve(process.cwd(), dir || '', name);

  copyDir(tempDir, targetDir, (err) => {
    console.log(err);
  });
}

function copyDir(src, dist, callback) {
  fs.access(dist, (err) => {
    if (err) {
      fs.mkdirSync(dist);
    }
    _copy(null, src, dist);
  });

  function _copy(err, src, dist) {
    if (err) {
      callback(err);
    } else {
      fs.readdir(src, (err, paths) => {
        if (err) {
          callback(err);
        } else {
          paths.forEach(path => {
            const _src = `${src}/${path}`;
            const _dist = `${dist}/${path}`;

            fs.stat(_src, (err, stat) => {
              if (err) {
                callback(err);
              } else {
                if (stat.isFile()) {
                  let content = fs.readFileSync(_src, 'utf8');
                  if (/index\.html$/.test(_src)) {
                    content = content.replace(/{{name}}/g, micrositeName);
                  }
                  fs.writeFileSync(_dist, content);
                } else if (stat.isDirectory()) {
                  copyDir(_src, _dist, callback);
                }
              }
            });
          });
        }
      });
    }
  }
}

module.exports = (name, options) => {
  const copy2Dir = options.dir;
  micrositeName = name;

  fs.access(copy2Dir, (err) => {
    if (err) {
      fs.mkdirSync(copy2Dir);
    }
  });

  if (name) {
    const dir = path.resolve(process.cwd(), copy2Dir || '.', name);
    if (fs.existsSync(dir)) {
      console.log('the name is already existed. please change another name');
    } else {
      run(name, copy2Dir);
    }
  } else {
    const questions = [{
      type: 'input',
      name: 'name',
      message: 'please enter the microsite name:',
      async validate(input) {
        const done = this.async();
        if (input.length === 0) {
          done('you must input a name.');
          return false;
        }
        const dir = path.resolve(process.cwd(), copy2Dir || '.', input);
        if (fs.existsSync(dir)) {
          done('the name is already existed. please change another name');
        }
        done(null, true);
      }
    }];
  
    inquirer.prompt(questions)
      .then(answers => {
        run(answers.name, copy2Dir);
      });
  }
}
