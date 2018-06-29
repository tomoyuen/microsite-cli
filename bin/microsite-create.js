#!/usr/bin/env node
const program = require('commander');

program
  .usage('<name>')
  .description('create a new microsite')
  .option('-d, --dir <targetDir>')
  .action((name, cmd) => {
    require('../lib/create')(name, cleanArgs(cmd));
  });

program.parse(process.argv);

function cleanArgs(cmd) {
  const args = {};

  cmd.options.forEach(item => {
    const key = item.long.replace(/^--/, '');

    if (typeof cmd[key] !== 'function') {
      args[key] = cmd[key];
    }
  });

  return args;
}