//
// COMPACTNESS FEATURES
//
//   Measures of compactness compare district shapes to various ideally compact
//   benchmarks, such as circles.All else equal, more compact districts are better.

import * as PC from 'polygon-clipping';
import * as Poly from '@dra2020/poly';
import * as Util from '@dra2020/util';

import { GrahamScanner } from './graham-scan';

import * as T from './types';


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

// FEATURE 1: X-SYMMETRY - The same as Y-SYMMETRY except reflect the district D
// around a horizontal line going through the centroid. See below.

export function calcXSymmetry(poly: any): number
{
  const [cx, ] = meanCentroid(poly);
  const sym_x = calcSymmetry(poly, reflectOverX(cx))

  return sym_x;
}


// FEATURE 2: Y-SYMMETRY - The area of a district overlapping with its
// reflection around a vertical line going through the centroid, divided by
// the area of the district. Values range [1–2].

// 1. Find the centroid
// 2. Take the area of the district
// 3. Flip the shape about its x or y axis, running through the centroid
// 4. Calculate the union of the original shape and its mirror
// 5. Take the ratio of the area of that union* and the area of the original shape

export function calcYSymmetry(poly: any): number
{
  const [, cy] = meanCentroid(poly);
  const sym_y = calcSymmetry(poly, reflectOverY(cy))

  return sym_y;
}

export function calcSymmetry(poly: any, transformFn: any): number
{
  const reflectedPoints = Poly.polyUnpack(Poly.polyTransform(poly, transformFn));
  const polyPoints = poly.geometry.coordinates;

  const unionedPoly = combineTwoPolys(polyPoints, reflectedPoints);

  const area: number = Poly.polyArea(poly);
  const unionedArea: number = Poly.polyArea(unionedPoly);

  return unionedArea / area;
}

function meanCentroid(poly: any): T.Point
{
  const X = 0, Y = 1;

  let n: number = 0;
  let x_tot: number = 0;
  let y_tot: number = 0;

  let coords: any = poly.geometry.coordinates;
  if (Util.depthof(coords) == 4) coords = [ coords ];  // normalize to multipolygon

  const nPolys: number = coords.length;
  for (let i = 0; i < nPolys; i++)                     // for each polygon
  {
    const nRings: number = coords[i].length;

    for (let j = 0; j < nRings; j++)                   // for each ring
    {                                                  // do
      if (j > 0) continue;                             // skip the holes

      for (let pt of coords[i][j])                     // for each point
      {                                                // do
        n += 1;
        x_tot += pt[X];
        y_tot += pt[Y];
      }
    }
  }

  const centroid: T.Point = [x_tot / n, y_tot / n];
 
  return centroid;
}

function reflectOverX(x0: number): any
{
  return function (pt: T.Point): T.Point
  {
    const [x, y] = pt;

    return [2 * x0 - x, y];
  }
}

function reflectOverY(y0: number): any
{
  return function (pt: T.Point): T.Point
  {
    const [x, y] = pt;

    return [x, 2 * y0 - y];
  }
}

// Combine two polygons using PC.union:
// - https://www.npmjs.com/package/polygon-clipping
// - https://en.wikipedia.org/wiki/GeoJSON#Geometries
// - https://www.npmjs.com/package/geojson
// - https://www.npmjs.com/package/shapefile

export function combineTwoPolys(poly1: any, poly2: any): any
{
  // Terry's workaround
  let _union: any = undefined;
  let anyPC: any = PC;
  if (anyPC.union) _union = anyPC.union;
  if (anyPC.default.union) _union = anyPC.default.union;
  if (_union === undefined) throw 'Unable to load union function from polygon-clipping';

  return _union(poly1, poly2);
}


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

// Note: This is not THE convex hull, but rather a metric based on it.
export function calcConvexHullFeature(area: number, chArea: number): number
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


export function featureizePoly(poly: any, options?: Poly.PolyOptions): T.CompactnessFeatures
{
  if (options === undefined) options = Poly.DefaultOptions;

  const area: number = Poly.polyArea(poly);
  const perimeter: number = Poly.polyPerimeter(poly, options);
  const diameter = Poly.polyDiameter(poly, options);

  // console.log(`Area = ${(area / 1000000).toFixed(4)}, Perimeter = ${(perimeter / 1000).toFixed(4)}, Diameter = ${(diameter / 1000).toFixed(4)}`);

  // TODO - Discuss w/ Terry
  const bUseAltHull: boolean = true;
  const ch = bUseAltHull ? makeConvexHull(poly) : Poly.polyConvexHull(poly); 

  const hullArea: number = Poly.polyArea(ch);

  const result: T.CompactnessFeatures = [
    calcXSymmetry(poly),
    calcYSymmetry(poly),
    calcReock(area, diameter),
    0,  // bbox
    calcPolsbyPopper(area, perimeter),
    calcConvexHullFeature(area, hullArea),
    calcSchwartzberg(area, perimeter)
  ]

  return result;
}


// An alternate implementation of Convex Hull using the Graham Scan algorithm

function makeConvexHull(poly: any, options?: Poly.PolyOptions): any
{
  let points = getExteriorPoints(poly);
  if (points == null) return null;

  let scanner = new GrahamScanner();

  for (let pt of points) {
    scanner.addPoint(pt);
  }

  const ch: T.Point[] = scanner.getHull();

  return [ ch ];
}

function getExteriorPoints(poly: any): T.Point[]
{
  let coords: any = poly.geometry.coordinates;
  if (Util.depthof(coords) == 4) coords = [ coords ];  // normalize to multipolygon
  
  let points: T.Point[] = [];

  const nPolys: number = coords.length;
  for (let i = 0; i < nPolys; i++)                     // for each polygon
  {
    const nRings: number = coords[i].length;

    for (let j = 0; j < nRings; j++)                   // for each ring
    {                                                  // do
      if (j > 0) continue;                             // skip the holes

      for (let pt of coords[i][j])                     // for each point
      {                                                // do
        points.push(pt);
      }
    }
  }
 
  return points;
}


// MINIMUM BOUNDING RECTANGLE (aka smallest enclosing rectangle)
// * Patterned after whuber’s R implementation below
export function minimumBoundingRectangle(poly: any): number
{
  const ch: any = makeConvexHull(poly);

  return 42;
}

/* See: https://gis.stackexchange.com/questions/22895/finding-minimum-area-rectangle-for-given-points

MBR <- function(p) {
  # Analyze the convex hull edges     
  a <- chull(p)                                   # Indexes of extremal points
  a <- c(a, a[1])                                 # Close the loop
  e <- p[a[-1],] - p[a[-length(a)], ]             # Edge directions
  norms <- sqrt(rowSums(e^2))                     # Edge lengths
  v <- e / norms                                  # Unit edge directions
  w <- cbind(-v[,2], v[,1])                       # Normal directions to the edges

  # Find the MBR
  vertices <- p[a, ]                              # Convex hull vertices
  x <- apply(vertices %*% t(v), 2, range)         # Extremes along edges
  y <- apply(vertices %*% t(w), 2, range)         # Extremes normal to edges
  areas <- (y[1,]-y[2,])*(x[1,]-x[2,])            # Areas
  k <- which.min(areas)                           # Index of the best edge (smallest area)

  # Form a rectangle from the extremes of the best edge
  cbind(x[c(1,2,2,1,1),k], y[c(1,1,2,2,1),k]) %*% rbind(v[k,], w[k,])
}

*/
