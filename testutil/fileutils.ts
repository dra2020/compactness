//
// UTILITIES
//

import * as fs from 'fs';
import * as path from 'path';
import parse from 'csv-parse/lib/sync';

// HELPERS TO LOAD SAMPLE DATA FROM DISK

// A clone of 'carefulRead' in DRA-CLI
export function readTXTcareful(file: string): any {
  try {
    const s: string = fs.readFileSync(file, 'utf8');
    // let o: any = JSON.parse(s);
    return s;
  }
  catch (err) {
    console.log("Error reading text file ...");
    return null;
  }
}

export function readTXT(file: string): any {
  let fullPath: string;
  if (path.isAbsolute(file)) {
    fullPath = file;
  }
  else {
    fullPath = path.resolve(file);
  }

  return readTXTcareful(fullPath);
}

function parseString(value: string): string {
  // Remove surrounding single or double quotes
  value = value.replace(/^"(.*)"$/, '$1')
  value = value.replace(/^'(.*)'$/, '$1')

  return value;
}


// Following the clone above, except for CSV, using the csv-parse/sync API
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

// A clone of 'carefulRead' in DRA-CLI
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

