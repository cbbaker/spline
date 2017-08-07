import math from 'mathjs';

import { createMatrix, computePolynomials, deltas } from './spline';


describe('createMatrix', () => {
  test('creates the point to coefficient matrix', () => {
    expect(math.equal(createMatrix([1,1]), math.sparse([[1,1,1, 0, 0,0],
                                                        [1,2,3,-1, 0,0],
                                                        [0,2,6, 0,-2,0],
                                                        [ 0, 0,0, 1,1,1],
                                                        [-1, 0,0, 1,2,3],
                                                        [ 0,-2,0, 0,2,6]]))).toBeTruthy();
  });
});

describe('computePolynomials', () => {
  function verifyPolynomials(start, end, polynomials) {
    expect(polynomials[0].evalAt(0)).toBeCloseTo(start, 5);
    const last = polynomials[polynomials.length - 1];
    expect(last.evalAt(last.knot)).toBeCloseTo(end, 5);
    for (var i = 0; i < polynomials.length - 1; ++i) {
      verifyIntermediate(polynomials[i], polynomials[i + 1]);
      verifyIntermediate(polynomials[i].derivative(), polynomials[i + 1].derivative());
      verifyIntermediate(polynomials[i].derivative().derivative(), polynomials[i + 1].derivative().derivative());
    }
  }

  function verifyIntermediate(first, second) {
    expect(first.evalAt(first.knot)).toBeCloseTo(second.evalAt(0), 5);
  }

  test('computes the correct spline polynomials', () => {
    const [xPolynomials, yPolynomials] = computePolynomials([[0, 0.25], [0.5, 0.75], [1, 0.25]]);
    verifyPolynomials(0, 1, xPolynomials);
    verifyPolynomials(0.25, 0.25, yPolynomials);
  });
});

describe('deltas', () => {
  test('computes the deltas of an array', () => {
    expect(deltas([0, 1, 2, 3, 5])).toEqual([1, 1, 1, 2]);
  });
});
