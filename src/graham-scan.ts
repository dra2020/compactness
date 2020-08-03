//
// CONVEX HULL USING GRAHAM SCAN ALGORITHM
//

import * as T from './types';

const X = 0, Y = 1;

export class GrahamScanner
{
  anchorPoint: T.Point | undefined;
  reverse: boolean | any;
  points: T.Point[];

  constructor()
  {
    this.anchorPoint = undefined;
    this.reverse = false;
    this.points = [];
  }
  Point(x: number, y: number)
  {
    const pt: T.Point = [x, y];

    return pt;
  }
  _findPolarAngle(a: T.Point, b: T.Point): number
  {
    const ONE_RADIAN = 57.295779513082;
    let deltaX, deltaY;

    //if the points are undefined, return a zero difference angle.
    if (!a || !b) return 0;

    deltaX = (b[X] - a[X]);
    deltaY = (b[Y] - a[Y]);

    if (deltaX == 0 && deltaY == 0) {
        return 0;
    }

    let angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

    if (this.reverse) {
      if (angle <= 0) {
          angle += 360;
      }
    }
    else
    {
      if (angle >= 0) {
          angle += 360;
      }
    }

    return angle;
  }
  addPoint(pt: T.Point): void
  {
    //Check for a new anchor
    const newAnchor =
        ( this.anchorPoint === undefined ) ||
        ( this.anchorPoint[Y] > pt[Y] ) ||
        ( this.anchorPoint[Y] === pt[Y] && this.anchorPoint[X] > pt[X] );

    if ( newAnchor ) {
      if ( this.anchorPoint !== undefined ) {
          this.points.push(pt);
      }
      this.anchorPoint = pt;
    }
    else
    {
      this.points.push(pt);
    }
  }
  _pointCompare(a: T.Point, b: T.Point) 
  {
    const polarA = this._findPolarAngle(this.anchorPoint as T.Point, a);
    const polarB = this._findPolarAngle(this.anchorPoint as T.Point, b);
  
    if (polarA < polarB) {
        return -1;
    }
    if (polarA > polarB) {
        return 1;
    }
  
    return 0;
  }
  _sortPoints(): T.Point[] 
  {
    var self = this;

    return this.points.sort(this._pointCompare);
  }
  _checkPoints(p0: T.Point, p1: T.Point, p2: T.Point): boolean 
  {
    let difAngle;
    const cwAngle = this._findPolarAngle(p0, p1);
    const ccwAngle = this._findPolarAngle(p0, p2);

    if (cwAngle > ccwAngle) {
      difAngle = cwAngle - ccwAngle;

      return !(difAngle > 180);
    }
    else if (cwAngle < ccwAngle)
    {
      difAngle = ccwAngle - cwAngle;

      return (difAngle > 180);
    }

    return true;
  }
  getHull(): T.Point[] 
  {
    let hullPoints: T.Point[] = [];
    let points: T.Point[];
    let pointsLength: number;

    this.reverse = this.points.every(
      function (point)
      {
        return (point[X] < 0 && point[Y] < 0);
      }
    );

    points = this._sortPoints() as T.Point[];
    pointsLength = points.length;

    //If there are less than 3 points, joining these points creates a correct hull.
    if (pointsLength < 3) {
        points.unshift(this.anchorPoint as T.Point);
        return points;
    }

    //move first two points to output array
    const first: T.Point = points.shift() as T.Point;
    const second: T.Point = points.shift() as T.Point;
    hullPoints.push(first, second);

    //scan is repeated until no concave points are present.
    while (true) {
      let p0: T.Point;
      let p1: T.Point;
      let p2: T.Point;

      hullPoints.push(points.shift() as T.Point);

      p0 = hullPoints[hullPoints.length - 3];
      p1 = hullPoints[hullPoints.length - 2];
      p2 = hullPoints[hullPoints.length - 1];

      if (this._checkPoints(p0, p1, p2)) {
          hullPoints.splice(hullPoints.length - 2, 1);
      }

      if (points.length == 0) 
      {
        if (pointsLength == hullPoints.length) 
        {
          //check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
          const ap: T.Point = this.anchorPoint as T.Point;
          //remove any udefined elements in the hullPoints array.
          hullPoints = hullPoints.filter(function(p) { return !!p; });
          if (!hullPoints.some(function(p){
                  return(p[X] == ap[X] && p[Y] == ap[Y]);
              })) {
              hullPoints.unshift(this.anchorPoint as T.Point);
          }
          return hullPoints;
        }
        points = hullPoints;
        pointsLength = points.length;
        hullPoints = [];
        const first: T.Point = points.shift() as T.Point;
        const second: T.Point = points.shift() as T.Point;
        hullPoints.push(first, second);
      }
    }
  }
}



/**
 * Graham's Scan Convex Hull Algorithm
 * @desc An implementation of the Graham's Scan Convex Hull algorithm in JavaScript.
 * @author Brian Barnett, brian@3kb.co.uk, http://brianbar.net/ || http://3kb.co.uk/
 * @version 1.0.5
 */

/* From:
 * https://www.tutorialspoint.com/Graham-Scan-Algorithm
 * http://brian3kb.github.io/graham_scan_js/
 */

/*
function ConvexHullGrahamScan() {
  this.anchorPoint = undefined;
  this.reverse = false;
  this.points = [];
}

ConvexHullGrahamScan.prototype = {

  constructor: ConvexHullGrahamScan,

  Point: function (x, y) {
      this.x = x;
      this.y = y;
  },

  _findPolarAngle: function (a, b) {
      var ONE_RADIAN = 57.295779513082;
      var deltaX, deltaY;

      //if the points are undefined, return a zero difference angle.
      if (!a || !b) return 0;

      deltaX = (b.x - a.x);
      deltaY = (b.y - a.y);

      if (deltaX == 0 && deltaY == 0) {
          return 0;
      }

      var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

      if (this.reverse){
          if (angle <= 0) {
              angle += 360;
          }
      }else{
          if (angle >= 0) {
              angle += 360;
          }
      }

      return angle;
  },

  addPoint: function (x, y) {
      //Check for a new anchor
      var newAnchor =
          (this.anchorPoint === undefined) ||
          ( this.anchorPoint.y > y ) ||
          ( this.anchorPoint.y === y && this.anchorPoint.x > x );

      if ( newAnchor ) {
          if ( this.anchorPoint !== undefined ) {
              this.points.push(new this.Point(this.anchorPoint.x, this.anchorPoint.y));
          }
          this.anchorPoint = new this.Point(x, y);
      } else {
          this.points.push(new this.Point(x, y));
      }
  },

  _sortPoints: function () {
      var self = this;

      return this.points.sort(function (a, b) {
          var polarA = self._findPolarAngle(self.anchorPoint, a);
          var polarB = self._findPolarAngle(self.anchorPoint, b);

          if (polarA < polarB) {
              return -1;
          }
          if (polarA > polarB) {
              return 1;
          }

          return 0;
      });
  },

  _checkPoints: function (p0, p1, p2) {
      var difAngle;
      var cwAngle = this._findPolarAngle(p0, p1);
      var ccwAngle = this._findPolarAngle(p0, p2);

      if (cwAngle > ccwAngle) {

          difAngle = cwAngle - ccwAngle;

          return !(difAngle > 180);

      } else if (cwAngle < ccwAngle) {

          difAngle = ccwAngle - cwAngle;

          return (difAngle > 180);

      }

      return true;
  },

  getHull: function () {
      var hullPoints = [],
          points,
          pointsLength;

      this.reverse = this.points.every(function(point){
          return (point.x < 0 && point.y < 0);
      });

      points = this._sortPoints();
      pointsLength = points.length;

      //If there are less than 3 points, joining these points creates a correct hull.
      if (pointsLength < 3) {
          points.unshift(this.anchorPoint);
          return points;
      }

      //move first two points to output array
      hullPoints.push(points.shift(), points.shift());

      //scan is repeated until no concave points are present.
      while (true) {
          var p0,
              p1,
              p2;

          hullPoints.push(points.shift());

          p0 = hullPoints[hullPoints.length - 3];
          p1 = hullPoints[hullPoints.length - 2];
          p2 = hullPoints[hullPoints.length - 1];

          if (this._checkPoints(p0, p1, p2)) {
              hullPoints.splice(hullPoints.length - 2, 1);
          }

          if (points.length == 0) {
              if (pointsLength == hullPoints.length) {
                  //check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
                  var ap = this.anchorPoint;
                  //remove any udefined elements in the hullPoints array.
                  hullPoints = hullPoints.filter(function(p) { return !!p; });
                  if (!hullPoints.some(function(p){
                          return(p.x == ap.x && p.y == ap.y);
                      })) {
                      hullPoints.unshift(this.anchorPoint);
                  }
                  return hullPoints;
              }
              points = hullPoints;
              pointsLength = points.length;
              hullPoints = [];
              hullPoints.push(points.shift(), points.shift());
          }
      }
  }
};

// EXPORTS

if (typeof define === 'function' && define.amd) {
  define(function() {
      return ConvexHullGrahamScan;
  });
}
if (typeof module !== 'undefined') {
  module.exports = ConvexHullGrahamScan;
}


*/
