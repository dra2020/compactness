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
  .example('$0 score -i foo.shp', 'Score a set of shapes.')
  .demandCommand(1, 'You must specify a command to execute.')
  .command('score', 'Score a set of shapes.')
  .option('verbose', {
    alias: 'v',
    describe: 'Specify whether code should log to STDOUT.',
    type: 'boolean',
    default: false
  })
  .option('input', {
    alias: 'i',
    describe: 'The name of the shapefile or geojson',
    type: 'string'
  })
  .demandOption([],  // None, so naked 'verify' command works
    'Please specify all the args.')
  .help()
  .argv;


// PROCESS COMMAND LINE ARGS

let command = argv._[0]

const input = argv.input;


// EXECUTE THE COMMAND

// Run from the project directory (sample commands inline below).
switch (command) {
  case 'score': {
    // TODO
    // $ utils/main.js score -i <shapefile>
    // $ utils/main.js score -i './testdata/first20/first20.shp'

    // scoreShape();
    if (input)
    {
      console.log('TODO: Score shapes in file:', input as string);
    }

    break;
  }
  case 'score-shp': {
    // TODO
    // $ utils/main.js score-shp -i <shapefile>
    // $ utils/main.js score-shp -i './testdata/first20/first20.shp'
    async function doit()
    {
      if (input)
      {
        const shapes: GeoJSON.FeatureCollection = await FU.readShapefile(input);
        console.log(`Processing ${shapes.features.length} shapes in ${input}.`);
        console.log('');
        console.log('#', 'sym_x', 'sym_y', 'reock', 'bbox', 'polsby', 'hull', 'schwartzberg');

        for (let i = 0; i < shapes.features.length; i++)
        {
          // console.log('Processing shape:', i + 1, '=', shapes.features[i]);
          const features = featureizeShape(shapes.features[i]);
          console.log(i + 1, features[T.Feature.Reock]);  // TODO
        }
      }
    }
    doit();
  
    break;
  }
  case 'score-geojson': {
    // $ utils/main.js score-geojson -i <geojson>
    // $ utils/main.js score-geojson -i './testdata/sample.geojson'
    if (input)
    {
      const shapes = FU.readJSON(input) as GeoJSON.FeatureCollection;
      // const nothing: T.FeaturesEntry[] = [];
      // const shapes = FU.readJSON('./testdata/sample.geojson') as GeoJSON.FeatureCollection;

      // processShapes(shapes, nothing);

      console.log('TODO: Score shapes in geojson:', input as string);
    }

    break;
  }
  case 'verify': {
    // TODO
    // $ utils/main.js verify
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
