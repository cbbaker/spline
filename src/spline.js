import math from 'mathjs';
import Polynomial from './polynomial';

const mat1 = knot => {
    const knot2 = knot * knot;
    const knot3 = knot2 * knot;
    return math.matrix([[1 * knot, 1 * knot2, 1 * knot3],
                        [1,        2 * knot,  3 * knot2],
                        [0,        2,         6 * knot ]]);
};

const mat2 = math.matrix([[0,0,0],
                          [-1,0,0],
                          [0,-2,0]]);

export function createMatrix(knots) {
  const ptCount = knots.length;
  const dim = ptCount * 3;
  var result = math.zeros(dim, dim, 'sparse');
  var i;
  for (i = 0; i < dim; i += 3) {
    const index = i/3;
    const knot = knots[index];
    const r1 = [i, i + 1, i + 2];
    const r2 = [(i + 3) % dim, (i + 4) % dim, (i + 5) % dim];
    result = math.subset(result, math.index(r1, r1), mat1(knot));
    result = math.subset(result, math.index(r1, r2), mat2);
  }

  return result;
};

export function computePolynomials(pts) {
  const splineCount = pts.length - 1;
  var knots = [];
  for (var i = 0; i < splineCount; ++i) {
    const deltaX = pts[i+1][0] - pts[i][0];
    const deltaY = pts[i+1][1] - pts[i][1];
    knots.push(Math.sqrt(deltaX*deltaX + deltaY*deltaY));
  }
  const dim = splineCount * 3;
  const matrix = createMatrix(knots);
  const invMatrix = math.inv(matrix);
  const coefficientMatrix = math.subset(invMatrix, math.index(math.range(0, dim), math.range(0, dim, 3)));

  const coords = math.transpose(pts);
  return coords.map(coord => coefficientHelper(coefficientMatrix, knots, coord));
};

export function coefficientHelper(matrix, knots, values) {
  const splineCount = values.length - 1;
  const deltaVs = deltas(values);
  const coefficients = math.multiply(matrix, math.transpose(deltaVs));
  const reshaped = math.reshape(coefficients, [splineCount, 3]);
  const toConcat = math.reshape(math.subset(values, math.index(math.range(0, splineCount))), [splineCount, 1]);
  const concatted = math.concat(toConcat, reshaped).toArray();

  var result = [];
  for (var i = 0; i < splineCount; ++i) {
    const poly = new Polynomial(concatted[i], knots[i]);
    result.push(poly);
  }

  return result;
};

export function deltas(array) {
  const length = array.length;
  const end = math.subset(array, math.index(math.range(1, length)));
  const start = math.subset(array, math.index(math.range(0, length -1)));
  return math.subtract(end, start);
};

// function printMatrix(value) {
//   console.log(math.format(math.matrix(value, 'dense'), 4));
//   return value;
// }
