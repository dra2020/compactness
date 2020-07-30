//
// A COMMAND-LINE INTERFACE FOR EXERCISING ROUTINES
//

import yargs from 'yargs';
import * as GeoJSON from 'geojson';
import * as Poly from '@dra2020/poly';
import * as FU from '../testutil/fileutils';

import { scoreShape, combineTwoPolys } from '../src/compact';
import { CompactnessFeatures, CompactnessFeature, featureizePoly } from '../src/compactness';


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
    // $ utils/main.js score-shp -i <shapefile>
    // $ utils/main.js score-shp -i './testdata/first20/first20.shp'
    async function doit()
    {
      if (input)
      {
        const shapes: GeoJSON.FeatureCollection = await FU.readShapefile(input);
        reportFeatures(shapes);
      }
    }
    doit();
  
    break;
  }
  case 'score-geojson': {
    // $ utils/main.js score-geojson -i <geojson>
    // $ utils/main.js score-geojson -i './testdata/sample.geojson'
    async function doit()
    {
      if (input)
      {
        const shapes = FU.readJSON(input) as GeoJSON.FeatureCollection;
        reportFeatures(shapes);
      }
    }
    doit();

    break;
  }
  case 'verify': {
    // TODO
    // $ utils/main.js verify
    console.log('Verify scoring features & feature-izing shapes');

    break;
  }
  case 'test': {
    // $ utils/main.js test -i './testdata/sample.geojson'
    async function doit()
    {
      if (input)
      {
        const shapes = FU.readJSON(input) as GeoJSON.FeatureCollection;

        let geom1: any = shapes.features[0].geometry;
        let geom2: any = shapes.features[1].geometry;
    
        // console.log("feature1 =", feature1.geometry);
        // console.log("feature2 =", feature2.geometry);
    
        combineTwoPolys(geom1.coordinates, geom2.coordinates);
      }
    }
    doit();

    break;
  }
  default: {
    console.log("Command not recognized.");
    break;
  }
}


// HELPERS

function reportFeatures(shapes: GeoJSON.FeatureCollection): void 
{
  // console.log(`Processing ${shapes.features.length} shapes in ${input}.`);
  // console.log('');
  console.log('#', 'sym_x', 'sym_y', 'reock', 'bbox', 'polsby', 'hull', 'schwartzberg');

  for (let i = 0; i < shapes.features.length; i++)
  {
    // console.log('Processing shape:', i + 1, '=', shapes.features[i]);
    const features = featureizePoly(shapes.features[i]);
    // const features = Poly.featureizePoly(shapes.features[i]);
    console.log("%d, %s, %s, %s, %s, %s, %s, %s",
      i + 1,
      // TODO - Add x_sym
      'N/A',
      // TODO - Add y_sym
      'N/A',
      features[CompactnessFeature.Reock].toFixed(4),
      // TODO - Add bbox
      'N/A',
      features[CompactnessFeature.Polsby].toFixed(4),
      features[CompactnessFeature.Hull].toFixed(4),
      features[CompactnessFeature.Schwartzberg].toFixed(4)
    );
  }
}



