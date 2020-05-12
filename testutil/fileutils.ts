//
// UTILITIES
//

import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';
import * as GeoJSON from 'geojson';


// READ SAMPLE FEATURE-IZED SHAPES

export type ShapeFeatures = FeatureEntry[];

export type FeatureEntry = [
  number,  // sym_x
  number,  // sym_y
  number,  // reock
  number,  // bbox
  number,  // polsby
  number,  // hull
  number,  // schwartzberg
  number   // score
];

export function readSampleFeatureSets(file: string): ShapeFeatures
{
  let shapes: ShapeFeatures = []; 

  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  const csvArray: any = readCSV(fullPath);

  for (let dictRow of csvArray)
  {
    // const n: number = Number(dictRow['n']);

    const f: FeatureEntry = [
      Number(dictRow['sym_x']),
      Number(dictRow['sym_y']),
      Number(dictRow['reock']),
      Number(dictRow['bbox']),
      Number(dictRow['polsby']),
      Number(dictRow['hull']),
      Number(dictRow['schwartzberg']),
      Number(dictRow['score'])
    ];

    shapes.push(f);
  }

  return shapes;
}


// TODO - READ SAMPLE SHAPES
//
// * This is close, I think.
// * But 'shapefile' thinks I'm trying to do this in a browser, I think.
// * Once I can read the shapes from the file system, I need to stuff them in
//   the shapes var and return that.
//
/*  To test the function, run:

$ utils/main.js featureize

*/

var shp = require('shapefile');

export function readSampleShapes(file: string): GeoJSON.FeatureCollection
{
  let fullPath: string;
  if (path.isAbsolute(file))
  {
    fullPath = file;
  }
  else
  {
    fullPath = path.resolve(file);
  }

  let shapes = {} as GeoJSON.FeatureCollection;

  // Read the shapefile and convert it into a FeatureCollection

  shp.open(fullPath)
    .then((source: any) => source.read()
      .then(function log(result: any)
      {
        if (result.done) return;
        console.log(result.value);
        return source.read().then(log);
      }))
    // .then((source: any) =>
    // {
    //   return source.read();
    // })
    .catch((err: any) =>
    {
      console.error(err.stack)
    });

  return shapes;
}


// HELPERS TO LOAD SAMPLE DATA FROM DISK

export function readCSV(file: string): any {
  try {
    let input: string = fs.readFileSync(file, 'utf8');
    let dictRows: any = parse(input, {
      columns: true,
      skip_empty_lines: true
    });
    return dictRows;
  }
  catch (err) {
    console.log("Error reading CSV file ...");
    return null;
  }
}

export function readJSONcareful(file: string): any {
  try {
    let s: string = fs.readFileSync(file, 'utf8');
    let o: any = JSON.parse(s);
    return o;
  }
  catch (err) {
    console.log("Error reading JSON file ...");
    return null;
  }
}

export function readJSON(file: string): any {
  let fullPath: string;
  if (path.isAbsolute(file)) {
    fullPath = file;
  }
  else {
    fullPath = path.resolve(file);
  }

  return readJSONcareful(fullPath);
}

