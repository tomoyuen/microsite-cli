#!/usr/bin/env node

const program = require('commander');
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

program
  .usage('<name>')
  .description('create a new microsite');

program.parse(process.argv);

let name = program.args[0];

if (name) {
  run();
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
      if (await fs.existsSync(dir)) {
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

function run() {
  console.log(process.cwd());
}