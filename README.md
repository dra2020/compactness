# compactness

All things compactness

## Exports

The 6 "smart" features from Kaufman & King's "know it when you see it" (KIWYSI)
compactness model plus Schwartzberg.

### calcReock (REOCK)
export declare function calcReock(area: number, diameter: number): number;

Reock is the primary measure of the dispersion of district
shapes, calculated as “the area of the distric to the area of the minimum spanning
circle that can enclose the district.”

> R = A / A(Minimum Bounding Circle)
> R = A / (π * (D / 2)^2)
> R = 4A / πD^22

where A is the area of the district and D is the diameter of the minimum bounding circle.

### calcPolsbyPopper (POLSBYPOPPER)
export declare function calcPolsbyPopper(area: number, perimeter: number): number;

Polsby-Popper is the primary measure of the indendentation
of district shapes, calculated as the “the ratio of the area of the district to 
the area of a circle whose circumference is equal to the perimeter of the district.”

> PP = A / A(C)

where C is that circle. In other words:

> P = 2πRc and A(C) = π (P / 2π)2

where P is the perimeter of the district and Rc is the radius of the circle.

Hence, the measure simplifies to:

> PP = 4π * (A / P2)

### calcConvexHullFeature (Hull(D))
export declare function calcConvexHullFeature(area: number, chArea: number): number;

 Convex Hull is a secondary measure of the dispersion of
district shapes, calculated as “the ratio of the district area to the area of
the minimum convex bounding polygon(also known as a convex hull) enclosing the
district.”

> CH = A / A(Convex Hull)

where a convex hull is the minimum perimeter that encloses all points in a shape, basically the shortest
unstretched rubber band that fits around the shape.

Note: This is not THE convex hull, but rather a metric based on it.

### calcSchwartzberg (SCHWARTZBERG)
export declare function calcSchwartzberg(area: number, perimeter: number): number;

Schwartzberg is a secondary measure of the degree of
indentation of district shapes, calculated as “the ratio of the perimeter of the
district to the circumference of a circle whose area is equal to the area of the
district.”

[Azavea](https://www.azavea.com/blog/2016/07/11/measuring-district-compactness-postgis/)
defines Schwartzberg as:

> S = 1 / (P / C)

where P is the perimeter of the district and C is the circumference of the circle. The radius of the circle is:

> Rc = SQRT(A / π)

So, the circumference of the circle is:

> C = 2πRc or C = 2π * SQRT(A / π)

Hence:

> S = 1 (P / 2π * SQRT(A / π))
> S = (2π * SQRT(A / π)) / P

NOTE - But this feature matches the verbal description of P / C(feature_helpers.R).
So, use P/C, not C/P as Azavea describes.

### calcYSymmetry (Y-SYMMETRY)
export declare function calcYSymmetry(poly: any): number;

The area of a district overlapping with its
reflection around a vertical line going through the centroid, divided by
the area of the district. Values range [1–2].

### calcXSymmetry (X-SYMMETRY)
export declare function calcXSymmetry(poly: any): number;

The same as Y-SYMMETRY except reflect the district
around a horizontal line going through the centroid.

### calcBoundingBox (BOUNDING-BOX)
export delcare function calcBoundingBox(poly: any): number;

Here this is defined as the ratio of the area of the
district to the area of the minimum bounding box of the district. It's not a
simple bounding box!

### scoreShapes
export declare function scoreShapes(shapes: GeoJSON.FeatureCollection, options?: Poly.PolyOptions): number[];

Take a GeoJSON feature collection of shapes and return an array 1–100 KIWYSI compactness scores.
Note: These are *ranks* where small is better.

## Build status for master branch

[![CircleCI](https://circleci.com/gh/dra2020/compactness.svg?style=svg&circle-token=5c5fdd1ea8b6aa5fc80ec7657b805b3953c58e00)](https://circleci.com/gh/dra2020/compactness)

## Repo contents

There are three packages that are part of this repo:

1. src: building compactness.bundle.js, the production code
2. cli: building cli.cs, a command line utility to run compactness
3. test: automated test code run by jest

## Developing in this repo

```npm install``` install all dependencies

```npm run build``` build all bundles

```npm run test``` run automated jest tests

