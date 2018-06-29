#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package');

program
  .version(pkg.version)
  .usage('<command> [options]')
  .command('create <name>', 'create a new microsite');

// program.on('--help', function(){
//   console.log(`
//   Examples:

//     # create a mew microsite
//     $ microsite create

//   `);
// });

program.parse(process.argv);