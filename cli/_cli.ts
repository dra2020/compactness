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
  case 'featureize-shp': {
    // $ utils/main.js featureize-shp -i <shapefile>
    // $ utils/main.js featureize-shp -i './testdata/first20/first20.shp'
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
  case 'featureize-geojson': {
    // $ utils/main.js featureize-geojson -i <geojson>
    // $ utils/main.js featureize-geojson -i './testdata/sample.geojson'
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
  case 'score-shp': {
    // $ utils/main.js score-shp -i <shapefile>
    // $ utils/main.js score-shp -i './testdata/first20/first20.shp'
    // $ utils/main.js score-shp -i './testdata/evenlyspaced20/evenlyspaced20.shp'
    async function doit()
    {
      if (input)
      {
        const shapes: GeoJSON.FeatureCollection = await FU.readShapefile(input);
        reportKIWYSI(shapes);
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
      const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/first20/smartfeats_first20.csv');
      compareFeatures(shapes, featureEntries);
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
  console.log('#', 'sym_x', 'sym_y', 'reock', 'bbox', 'polsby', 'hull', 'schwartzberg');

  for (let i = 0; i < shapes.features.length; i++)
  {
    const poly = shapes.features[i];
    const features: T.CompactnessFeatures = featureizePoly(poly);

    console.log("%d, %s, %s, %s, %s, %s, %s, %s",
      i + 1,
      features.sym_x.toFixed(4),
      features.sym_y.toFixed(4),
      features.reock.toFixed(4),
      features.bbox.toFixed(4),
      features.polsby.toFixed(4),
      features.hull.toFixed(4),
      features.schwartzberg.toFixed(4)
    );
  }
}

function reportKIWYSI(shapes: GeoJSON.FeatureCollection): void 
{
  console.log('#', 'sym_x', 'sym_y', 'reock', 'bbox', 'polsby', 'hull', 'schwartzberg', 'score');

  for (let i = 0; i < shapes.features.length; i++)
  {
    const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);
    let kiwysiScore: number = scoreShape(shapes.features[i], T.PCAModel.Revised);

    console.log("%d, %s, %s, %s, %s, %s, %s, %s, %s",
      i + 1,
      features.sym_x.toFixed(4),
      features.sym_y.toFixed(4),
      features.reock.toFixed(4),
      features.bbox.toFixed(4),
      features.polsby.toFixed(4),
      features.hull.toFixed(4),
      features.schwartzberg.toFixed(4),
      kiwysiScore.toFixed(4)
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
      features.sym_x.toFixed(6),
      features.sym_y.toFixed(6),
      features.reock.toFixed(6),
      features.bbox.toFixed(6),
      features.polsby.toFixed(6),
      features.hull.toFixed(6),
      features.schwartzberg.toFixed(6)
    );

    // The correct results
    const n = featureEntries[i].n;
    const correct = featureEntries[i].features;
    const score = featureEntries[i].score;

    console.log("     %s | %s | %s | %s | %s | %s | %s <<< Correct",
      correct.sym_x.toFixed(6),
      correct.sym_y.toFixed(6),
      correct.reock.toFixed(6),
      correct.bbox.toFixed(6),
      correct.polsby.toFixed(6),
      correct.hull.toFixed(6),
      correct.schwartzberg.toFixed(6)
    );

    console.log("     %s | %s | %s | %s | %s | %s | %s <<< Delta %",
      getNumberWithSign(delta(features.sym_x, correct.sym_x), 1) + "%   ",
      getNumberWithSign(delta(features.sym_y, correct.sym_y), 1) + "%   ",
      getNumberWithSign(delta(features.reock, correct.reock), 1) + "%   ",
      getNumberWithSign(delta(features.bbox, correct.bbox), 1) + "%   ",
      getNumberWithSign(delta(features.polsby, correct.polsby), 1) + "%   ",
      getNumberWithSign(delta(features.hull, correct.hull), 1) + "%   ",
      getNumberWithSign(delta(features.schwartzberg, correct.schwartzberg), 1)  + "%   "
    );
  }

  console.log(hr);
}

function delta(computed: number, correct: number): number
{
  return ((computed - correct) / correct) * 100
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
