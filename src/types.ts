//
// TYPE DEFINITIONS
//

export type Point = [number, number];

export type FeaturesEntry = number[];

export const enum CompactnessFeature
{
  Sym_x,
  Sym_y,
  Reock,
  Bbox,
  Polsby,
  Hull,
  Schwartzberg
}

export type CompactnessFeatures = [
  number,  // sym_x
  number,  // sym_y
  number,  // reock
  number,  // bbox
  number,  // polsby
  number,  // hull
  number   // schwartzberg
];
