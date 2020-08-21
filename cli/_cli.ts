//
// A COMMAND-LINE INTERFACE FOR EXERCISING ROUTINES
//

import yargs from 'yargs';
import * as GeoJSON from 'geojson';
import * as FU from '../testutil/fileutils';

import { scoreShape  } from '../src/kiwysi';
import { featureizePoly } from '../src/features';

import * as T from '../src/types';


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
    // $ utils/main.js verify
    async function doit()
    {
      const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');
      const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/smartfeats_first20.csv');
      // TODO
      compareFeatures(shapes, featureEntries);
    }
    doit();

    break;
  }
  /*
  case 'test': {
    // $ utils/main.js test -i './testdata/sample.geojson'
    async function doit()
    {
      if (input)
      {
        const shapes = FU.readJSON(input) as GeoJSON.FeatureCollection;

        let geom1: any = shapes.features[0].geometry;
        let geom2: any = shapes.features[1].geometry;
        
        combineTwoPolys(geom1.coordinates, geom2.coordinates);
      }
    }
    doit();

    break;
  }
  */
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
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);
    console.log("%d, %s, %s, %s, %s, %s, %s, %s",
      i + 1,
      features[T.CompactnessFeature.Sym_x].toFixed(4),
      features[T.CompactnessFeature.Sym_y].toFixed(4),
      features[T.CompactnessFeature.Reock].toFixed(4),
      features[T.CompactnessFeature.Bbox].toFixed(4),
      features[T.CompactnessFeature.Polsby].toFixed(4),
      features[T.CompactnessFeature.Hull].toFixed(4),
      features[T.CompactnessFeature.Schwartzberg].toFixed(4)
    );
  }
}

function compareFeatures(shapes: GeoJSON.FeatureCollection, featureEntries: T.FeaturesEntry[]): void 
{
  const hr = new Array(92 + 1).join('-');

  console.log('Computed features for shapes:');
  console.log('');
  console.log('## = sym_x    | sym_y    | reock    | bbox     | polsby   | hull     | schwartz  ');

  for (let i = 0; i < shapes.features.length; i++)
  {
    console.log(hr);

    // The calculated results
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);
    console.log("%s = %s | %s | %s | %s | %s | %s | %s <<< Calc'd",
      pad(i + 1, 2),
      features[T.CompactnessFeature.Sym_x].toFixed(6),
      features[T.CompactnessFeature.Sym_y].toFixed(6),
      features[T.CompactnessFeature.Reock].toFixed(6),
      features[T.CompactnessFeature.Bbox].toFixed(6),
      features[T.CompactnessFeature.Polsby].toFixed(6),
      features[T.CompactnessFeature.Hull].toFixed(6),
      features[T.CompactnessFeature.Schwartzberg].toFixed(6)
    );

    // The correct results
    const n = featureEntries[i][0];
    const correct = featureEntries[i].slice(1, -1) as T.CompactnessFeatures;
    const score = featureEntries[i][-1];

    console.log("     %s | %s | %s | %s | %s | %s | %s <<< Correct",
      correct[T.CompactnessFeature.Sym_x].toFixed(6),
      correct[T.CompactnessFeature.Sym_y].toFixed(6),
      correct[T.CompactnessFeature.Reock].toFixed(6),
      correct[T.CompactnessFeature.Bbox].toFixed(6),
      correct[T.CompactnessFeature.Polsby].toFixed(6),
      correct[T.CompactnessFeature.Hull].toFixed(6),
      correct[T.CompactnessFeature.Schwartzberg].toFixed(6)
    );

    // Delta percentages
    let delta: number[] = [];
    for (let j = 0; j < features.length; j++)
    {
      delta.push(((features[j] - correct[j]) / correct[j]) * 100);
    }

    console.log("     %s | %s | %s | %s | %s | %s | %s <<< Delta %",
      getNumberWithSign(delta[T.CompactnessFeature.Sym_x], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Sym_y], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Reock], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Bbox], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Polsby], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Hull], 1) + "%   ",
      getNumberWithSign(delta[T.CompactnessFeature.Schwartzberg], 1)  + "%   "
    );
  }

  console.log(hr);
}

function pad(num: number, size: number): string {
  var s = num+"";
  while (s.length < size) s = " " + s;
  return s;
}

function getNumberWithSign(input: number, decimals: number): string {
  if (input === 0) {
    return "0"
  }

  const sign = input < 0 ? '-' : '+';

  return `${sign}${Math.abs(input).toFixed(decimals)}`;
}
