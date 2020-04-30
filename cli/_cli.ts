//
// A COMMAND-LINE INTERFACE FOR EXERCISING ROUTINES
//
/* Example:

$ ./main.js command

*/

import yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';

import { hello } from '../src/compact';


// BEGIN COMMAND LINE IMPLEMENTATION

let argv = yargs
  .usage('Usage: $0 command [options]')
  .example('$0 score -p foo.txt -d bar.csv', 'Score a plan.')  // TODO
  .demandCommand(1, 'You must specify a command to execute.')
  .command('score', 'Score a plan.')  // TODO
  // TODO
  .option('verbose', {
    alias: 'v',
    describe: 'Specify whether code should log to STDOUT.',
    type: 'boolean',
    default: false
  })
  .demandOption([],
    'Please specify all the args.')
  .help()
  .argv;


// PROCESS COMMAND LINE ARGS

let command = argv._[0]


// EXECUTE THE COMMAND

// TODO

switch (command) {
  // TODO
  case 'hello': {
    hello();

    break;
  }
  default: {
    console.log("Command not recognized.");
    break;
  }
}
