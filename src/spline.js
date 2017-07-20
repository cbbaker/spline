import math from 'mathjs';
import Polynomial from './polynomial';

const mat1 = math.matrix([[1,1,1],
                          [1,2,3],
                          [0,2,6]]);

const mat2 = math.matrix([[0,0,0],
                          [-1,0,0],
                          [0,-2,0]]);

export function createMatrix(ptCount) {
  const dim = ptCount * 3;
  var result = math.zeros(dim, dim, 'sparse');
  var i;
  for (i = 0; i < dim; i += 3) {
    const r1 = [i, i + 1, i + 2];
    const r2 = [(i + 3) % dim, (i + 4) % dim, (i + 5) % dim];
    result = math.subset(result, math.index(r1, r1), mat1);
    result = math.subset(result, math.index(r1, r2), mat2);
  }

  return result;
};

export function computePolynomials(pts) {
  const splineCount = pts.length - 1;
  const dim = splineCount * 3;
  const matrix = createMatrix(splineCount);
  const invMatrix = math.inv(matrix);
  const coefficientMatrix = math.subset(invMatrix, math.index(math.range(0, dim), math.range(0, dim, 3)));
  const [xs, ys] = math.transpose(pts);
  const xPolynomials = coefficientHelper(coefficientMatrix, xs);
  const yPolynomials = coefficientHelper(coefficientMatrix, ys);

  return [xPolynomials, yPolynomials];
};

export function coefficientHelper(matrix, values) {
  const splineCount = values.length - 1;
  const deltaVs = deltas(values);
  const coefficients = math.multiply(matrix, math.transpose(deltaVs));
  const reshaped = math.reshape(coefficients, [splineCount, 3]);
  const toConcat = math.reshape(math.subset(values, math.index(math.range(0, splineCount))), [splineCount, 1]);
  const concatted = math.concat(toConcat, reshaped).toArray();

  var result = [];
  for (var i = 0; i < splineCount; ++i) {
    const poly = new Polynomial(concatted[i]);
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
