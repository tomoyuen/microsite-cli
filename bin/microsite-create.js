#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');

const program = require('commander');
const inquirer = require('inquirer');

program
  .usage('<name>')
  .description('create a new microsite');

program.parse(process.argv);

let name = program.args[0];

if (name) {
  const dir = path.resolve(process.cwd(), name);
  if (fs.existsSync(dir)) {
    console.log('the name is already existed. please change another name');
  } else {
    run();
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
      const dir = path.resolve(process.cwd(), input);
      if (fs.existsSync(dir)) {
        done('the name is already existed. please change another name');
      }
      done(null, true);
    }
  }];

  inquirer.prompt(questions)
    .then(answers => {
      name = answers.name;
      run();
    });
}

function copyDir(src, dist, callback) {
  fs.access(dist, function(err){
    if(err) {
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
                    content = content.replace(/{{name}}/g, name);
                    console.log(content);
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

function run() {
  const tempDir = path.resolve(__dirname, '../template');
  const targetDir = path.resolve(process.cwd(), name);

  copyDir(tempDir, targetDir, function() {
    console.log(err);
  });
}