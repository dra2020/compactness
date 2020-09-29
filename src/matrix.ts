//
// dotProduct - cloned from poly/matrix.ts, to avoid needing mathjs
//

// export type Matrix = number[][];
export type Vector = number[];                // A general vector or a row or a column
// export type Index = number[][];


export function dotProduct(a: Vector, b: Vector): number
{
  protect((a.length > 0) && (a.length == b.length), "In dotProduct, the vectors aren't the same length. ");

  return a.map((value, i) => value * b[i]).reduce((acc, val) => acc + val, 0);
};


// export function dotMultiply(a: Vector, b: Vector): Vector
// {
//   protect((a.length > 0) && (a.length == b.length), "In dotMultiply, the vectors aren't the same length. ");

//   let c: Vector = [];

//   for (let i = 0; i < a.length; i++)
//   {
//     c.push(a[i] * b[i]);
//   }

//   return c;
// }

// export function multiply(a: Matrix, b: Matrix): Matrix
// {
//   protect((nRows(a) > 0), "In multiply, input matrix 'a' has no rows. ");
//   protect((nCols(a) > 0), "In multiply, input matrix 'a' has no columns. ");
//   protect((nRows(b) > 0), "In multiply, input matrix 'b' has no rows. ");
//   protect((nCols(b) > 0), "In multiply, input matrix 'b' has no columns. ");

//   const m = nRows(a);
//   const n = nCols(a);
//   const p = nRows(b);
//   const q = nCols(b);

//   protect((p == n), "In multiply, the # rows in matrix 'b' doesn't match the number of columns in matrix 'a'.");

//   let c: Matrix = initialize(m, n);

//   for (let i = 0; i < m; i++)
//   {
//     for (let j = 0; j < q; j++)
//     {
//       const aRow = row(a, i);
//       const bCol = column(b, j);

//       c[i][j] = dotProduct(aRow, bCol);
//     }
//   }

//   return c;
// }

// HELPERS

// export function row(a: Matrix, i: number): Vector
// {
//   protect((nRows(a) > 0), "In row, input matrix has no rows. ");
//   protect((nCols(a) > 0), "In row, input matrix has no columns. ");
//   protect((i >= 0), "In row, invalid row index.");

//   return a[i];
// }

// export function column(a: Matrix, j: number): Vector
// {
//   protect((nRows(a) > 0), "In column, input matrix has no rows. ");
//   protect((nCols(a) > 0), "In column, input matrix has no columns. ");
//   protect((j >= 0), "In row, invalid column index.");

//   let v: any = [];

//   for (let i = 0; i < nRows(a); i++)
//   {
//     v.push(a[i][j]);
//   }

//   return v;
// }

// function initialize(rows: number, cols: number): Matrix
// {
//   protect(((rows > 0) || (cols > 0)), "In initialize, the # of rows or columns is not positive. ");

//   return [...Array(rows)].fill(0).map(() => [...Array(cols)].fill(0));
// };

// const nRows = (a: Matrix | Index) => a.length;
// const nCols = (a: Matrix | Index) => (a.length > 0) ? a[0].length : 0;

// export function dotProduct(a: Vector, b: Vector): number
// {
//   protect((a.length > 0) && (a.length == b.length), "In dotProduct, the vectors aren't the same length. ");

//   return a.map((value, i) => value * b[i]).reduce((acc, val) => acc + val, 0);
// };


function protect(condition: boolean, message: string): void
{
  if (!condition)
    throw new Error(message);
}
