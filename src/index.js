const program = require('commander');
const pkg = require('../package');

program
  .version(pkg.version)
  .usage('<command> [options]')
  .command('create', 'generate a microsite');

// program.on('--help', function(){
//   console.log(`
//   Examples:

//     # create a mew microsite
//     $ microsite create

//   `);
// });

program.parse(process.argv);

if (process.args) {
  // require(`./command/${program.args}.js`);
}