//
// TYPE DEFINITIONS
//

export const enum Feature
{
  Sym_x,
  Sym_y,
  Reock,
  Bbox,
  Polsby,
  Hull,
  Schwartzberg
}

export type ShapeFeatures = FeatureSet[];

export type FeatureSet = [
  number,  // sym_x
  number,  // sym_y
  number,  // reock
  number,  // bbox
  number,  // polsby
  number,  // hull
  number   // schwartzberg
];

export type FeaturesEntry = number[];
