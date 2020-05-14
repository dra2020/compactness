//
// A COMMAND-LINE INTERFACE FOR EXERCISING ROUTINES
//

import yargs from 'yargs';
import * as GeoJSON from 'geojson';

import * as FU from '../testutil/fileutils';

import * as T from '../src/types'
import { scoreShape, featureizeShape } from '../src/compact';


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

// Run from the project directory (sample commands inline below).
switch (command) {
  // TODO
  // $ utils/main.js score <shapefile>
  case 'score': {
    scoreShape();

    break;
  }
  // TODO - DELETE: First crack
  // $ utils/main.js read-shp
  // case 'read-shp': {
  //   const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');
  //   FU.readAndProcessShapes('./testdata/first20/first20.shp', processShapes, featureEntries) as GeoJSON.FeatureCollection;

  //   break;
  // }
  // $ utils/main.js straight-read
  case 'straight-read': {
    // const shapesGeoJSON = FU.readShapefile('./testdata/first20/first20.shp');
    async function doit()
    {
      const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');
      console.log('After reading shapes ...');
    }
    doit();
  
    break;
  }
  // $ utils/main.js read-geojson
  case 'read-geojson': {
    const nothing: T.FeaturesEntry[] = [];
    const shapes = FU.readJSON('./testdata/sample.geojson') as GeoJSON.FeatureCollection;
    processShapes(shapes, nothing);

    break;
  }
  // TODO
  // $ utils/main.js verify
  case 'verify': {
    console.log('Verify scoring features & feature-izing shapes');

    break;
  }
  default: {
    console.log("Command not recognized.");
    break;
  }
}


// HELPERS

function processShapes(shapes: GeoJSON.FeatureCollection, featureEntries: T.FeaturesEntry[]): void
{
  console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < shapes.features.length; i++)
  {
    console.log('Processing shape:', i + 1, '=', shapes.features[i]);
    featureizeShape(shapes.features[i]);
  }
}
