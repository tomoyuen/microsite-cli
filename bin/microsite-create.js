const program = require('commander');
const inquirer = require('inquirer');

program
  .command('create', 'generate a microsite')
  .action((options) => {
    const choices = ['asics3', 'asdf', 'asdfa'];
    // const question0 = {
    //   type: 'list',
    //   name: 'project',
    //   message: 'which microsite of project you want to create',
    //   choices
    // }
    const questions = [{
      type: 'list',
      name: 'project',
      message: 'which microsite of project you want to create',
      choices
    }, {
      type: 'input',
      name: 'name',
      message: 'please enter the microsite name',
      async validate(input) {
        const done = this.async();
        if (input.length === 0) {
          done('U must input a name');
          return false;
        }
        const dir = resolve(process.cwd(), input);
        if (await exists(dir)) {
          done('the name is already existed. please change another name');
        }
        done(null, true);
      }
    }];

    inquirer.prompt(questions)
      .then(answers => {
        console.log(answers);
      });

    console.log(options);
  });

program.parse(process.argv);
