//
// COMPACTNESS FEATURES
//
//   Measures of compactness compare district shapes to various ideally compact
//   benchmarks, such as circles.All else equal, more compact districts are better.

import * as PC from 'polygon-clipping';
import * as Poly from '@dra2020/poly';

type Point = [number, number];

// The 6 "smart" features from Kaufman & King's "know it when you see it" (KIWYSI)
// compactness model plus Schwartzberg:
//
// 1 - sym_x (X-SYMMETRY)
// 2 - sym_y (Y-SYMMETRY)
// 3 - reock (REOCK)
// 4 - bbox (BOUNDING-BOX)
// 5 - polsby (POPOLSBYPOPPERLSBY)
// 6 - hull (Hull(D))
// 7 - schwartzberg (SCHWARTZBERG)

// TODO
// FEATURE 1: X-SYMMETRY - The same as Y-SYMMETRY except reflect the district D
// around a horizontal line going through the centroid. See below.


// TODO
// FEATURE 2: Y-SYMMETRY - The area of a district overlapping with its
// reflection around a vertical line going through the centroid, divided by
// the area of the district. Values range [1–2].

// 1. Find the centroid
// 2. Take the area of the district
// 3. Flip the shape about its x or y axis, running through the centroid
// 4. Calculate the union of the original shape and its mirror
// 5. Take the ratio of the area of that union* and the area of the original shape

export function calcXSymmetry(poly: any): number
{
  // Normalize input
  let pp = Poly.polyNormalize(poly);

  const [cx, ] = meanCentroid(pp);
  const reflectedPoly = Poly.polyTransform(pp, reflectOverX(cx));

  // TODO - Union the two shapes together
  // const unionedPoly = addToPoly(pp, [Poly.polyNormalize(reflectedPoly)]);

  const area: number = Poly.polyArea(poly);
  const unionedArea: number = Poly.polyArea(reflectedPoly /*unionedPoly*/);

  return unionedArea / area;
}


// X/Y symmetry helpers

// TODO - Do I need to check for no points? If so, how?
function meanCentroid(poly: any): Point
{
  let n: number = 0;
  let x_tot: number = 0;
  let y_tot: number = 0;

  const pp = Poly.polyNormalize(poly);
  Poly.polyPackEachPoint(pp, (b: Float64Array, iPoly: number, iRing: number, iOffset: number) =>
  {
    if (iRing > 0) return;  // skip holes

    n += 1;
    x_tot += b[iOffset];
    y_tot += b[iOffset+1];
  });

  const centroid: Point = [x_tot / n, y_tot / n];
 
  return centroid;
}

function reflectOverX(x0: number): any
{
  return function (pt: Point): Point
  {
    const [x, y] = pt;

    return [2 * x0 - x, y];
  }
}

function reflectOverY(y0: number): any
{
  return function (pt: Point): Point
  {
    const [x, y] = pt;

    return [x, 2 * y0 - y];
  }
}


/* TODO - Get 'polygon-clipping' integrated and this working.
// Cloned from district-analytics/cli.ts
function addToPoly(poly: any, polys: any[]): any
{
  // TODO - POLY: Fix 'poly' import, so I don't have to do this workaround.
  // return PC.union(poly, ...polys);
  let union: any = PC.union;
  if (union === undefined)
    union = PC.default.union;

  return union(poly, ...polys);
}
*/


// FEATURE 3: REOCK -- Reock is the primary measure of the dispersion of district
// shapes, calculated as “the area of the distric to the area of the minimum spanning
// circle that can enclose the district.”
//
//    R = A / A(Minimum Bounding Circle)
//    R = A / (π * (D / 2)2)
//
//    R = 4A / πD2
//
// where A is the area of the district and D is the diameter of the minimum bounding circle.

export function calcReock(area: number, diameter: number): number
{
  return (4 * area) / (Math.PI * diameter ** 2);
}


// TODO
// FEATURE 4: "BOUNDING-BOX" is shorthand for the ratio of the area of the
// district to the area of the minimum bounding box of the district.


// FEATURE 5: POLSBYPOPPER - Polsby-Popper is the primary measure of the indendentation
// of district shapes, calculated as the “the ratio of the area of the district to 
// the area of a circle whose circumference is equal to the perimeter of the district.”
//
//    PP = A / A(C)
//
// where C is that circle. In other words:
//
//    P = 2πRc and A(C) = π (P / 2π)2
//
// where P is the perimeter of the district and Rc is the radius of the circle.
//
// Hence, the measure simplifies to:
//
//    PP = 4π * (A / P2)

export function calcPolsbyPopper(area: number, perimeter: number): number
{
  return (4 * Math.PI) * (area / perimeter ** 2);
}


// FEATURE 6: Hull(D) - Convex Hull is a secondary measure of the dispersion of
// district shapes, calculated as “the ratio of the district area to the area of
// the minimum convex bounding polygon(also known as a convex hull) enclosing the
// district.”
//
//    CH = A / A(Convex Hull)
// 
// where a convex hull is the minimum perimeter that encloses all points in a shape, basically the shortest
// unstretched rubber band that fits around the shape.

export function calcConvexHull(area: number, chArea: number): number
{
  return area / chArea;
}


// FEATURE 7: SCHWARTZBERG - Schwartzberg is a secondary measure of the degree of
// indentation of district shapes, calculated as “the ratio of the perimeter of the
// district to the circumference of a circle whose area is equal to the area of the
// district.”
//
// https://www.azavea.com/blog/2016/07/11/measuring-district-compactness-postgis/
// defines Schwartzberg as:
//
//    S = 1 / (P / C)
//
// where P is the perimeter of the district and C is the circumference of the circle. The radius of the circle is:
//
//    Rc = SQRT(A / π)
//
// So, the circumference of the circle is:
//
//    C = 2πRc or C = 2π * SQRT(A / π)
//
// Hence:
//
//    S = 1 (P / 2π * SQRT(A / π))
//
//    S = (2π * SQRT(A / π)) / P
//
// NOTE - But Aaron Kaufman's KIWYSI feature matches the verbal description of 
// P / C(feature_helpers.R). So, use P/C, not C/P as Azavea describes.

export function calcSchwartzberg(area: number, perimeter: number): number
{
  return perimeter / ((2 * Math.PI) * Math.sqrt(area / Math.PI));
}

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

export function featureizePoly(poly: any, options?: Poly.PolyOptions): CompactnessFeatures
{
  if (options === undefined) options = Poly.DefaultOptions;

  const pp = Poly.polyNormalize(poly);

  const area: number = Poly.polyArea(pp);
  const perimeter: number = Poly.polyPerimeter(pp, options);
  const diameter = Poly.polyDiameter(pp, options);

  const hullArea: number = Poly.polyArea(Poly.polyConvexHull(pp));

  const result: CompactnessFeatures = [
    0,  // sym_x
    0,  // sym_y
    calcReock(area, diameter),
    0,  // bbox
    calcPolsbyPopper(area, perimeter),
    calcConvexHull(area, hullArea),
    calcSchwartzberg(area, perimeter)
  ]

  return result;
}
