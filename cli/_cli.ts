//
// A COMMAND-LINE INTERFACE FOR EXERCISING ROUTINES
//
/* Example (from the project directory):

$ utils/main.js score
$ utils/main.js featureize

*/

import yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';
import * as GeoJSON from 'geojson';

import * as FU from '../testutil/fileutils';
import { scoreShape } from '../src/compact';
// import { processShapes } from '../test/compact.spec';


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
  case 'score': {
    scoreShape();

    break;
  }
  case 'read-shp': {
    FU.readAndProcessShapes('./testdata/first20/first20.shp', processShapes) as GeoJSON.FeatureCollection;

    break;
  }
  case 'read-geojson': {
    const shapes = FU.readJSON('./testdata/sample.geojson') as GeoJSON.FeatureCollection;
    processShapes(shapes);

    break;
  }
  case 'verify': {
    console.log('TODO: Verify scoring features & feature-izing shapes');

    break;
  }
  default: {
    console.log("Command not recognized.");
    break;
  }
}


// HELPERS

function processShapes(shapes: GeoJSON.FeatureCollection): void
{
  console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < shapes.features.length; i++)
  {
    console.log('Processing shape:', i + 1, '=', shapes.features[i]);
  }
}
