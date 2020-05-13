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

function fileToPath(file: string): string
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

  return fullPath;
}

export function readFeatureSets(file: string): ShapeFeatures
{
  let shapes: ShapeFeatures = []; 

  const fullPath: string = fileToPath(file);
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


// READ SAMPLE SHAPES

var shp = require('shapefile');

export function readAndProcessShapes(file: string, callback: (shapes: GeoJSON.FeatureCollection) => void): GeoJSON.FeatureCollection
{
  const fullPath: string = fileToPath(file);
  const buf = fs.readFileSync(fullPath);

  let shapes = {} as GeoJSON.FeatureCollection;
  shapes.type = "FeatureCollection";
  shapes.features = [] as GeoJSON.Feature[];
  
  shp.open(buf)
    .then((source: any) => source.read()
      .then(function readOne(result: any) {
        if (result.done)
        {
          callback(shapes);
          return;
        };
        shapes.features.push(result.value);
        return source.read().then(readOne);
      }))
    .catch((err: any) => console.error(err.stack));

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

