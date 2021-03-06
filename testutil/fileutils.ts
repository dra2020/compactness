//
// UTILITIES
//

import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';
import * as GeoJSON from 'geojson';

import * as T from '../src/types'


// READ SAMPLE FEATURE-IZED SHAPES

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

export function readFeatureSets(file: string): T.FeaturesEntry[]
{
  let featureEntries: T.FeaturesEntry[] = []; 

  const fullPath: string = fileToPath(file);
  const csvArray: any = readCSV(fullPath);

  for (let dictRow of csvArray)
  {
    const featuresEntry: T.FeaturesEntry = {
      n: Number(dictRow['n']),
      features: {
        sym_x: Number(dictRow['sym_x']),
        sym_y: Number(dictRow['sym_y']),
        reock: Number(dictRow['reock']),
        bbox: Number(dictRow['bbox']),
        polsby: Number(dictRow['polsby']),
        hull: Number(dictRow['hull']),
        schwartzberg: Number(dictRow['schwartzberg']),
      },
      score: Number(dictRow['score'])
    };

    featureEntries.push(featuresEntry);
  }

  return featureEntries;
}


// READ SAMPLE SHAPES

var shp = require('shapefile');
// https://www.npmjs.com/package/shapefile
// https://digital-geography.com/gis-with-javascript-tutorial-part-1/

export function readShapefile(file: string): Promise<GeoJSON.FeatureCollection>
{
  const fullPath: string = fileToPath(file);
  const buf = fs.readFileSync(fullPath);

  return shp.read(buf).catch((err: any) => console.error(err.stack));
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

