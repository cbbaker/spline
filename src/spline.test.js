import {createMatrix} from './spline';

describe('createMatrix', () => {
    test('creates the point to coefficient matrix', () => {
        expect(createMatrix(2)).toBe([[1,1,1, 0, 0,0],
                                      [1,2,3,-1, 0,0],
                                      [0,2,6, 0,-2,0],
                                      [ 0, 0,0, 1,1,1],
                                      [-1, 0,0, 1,2,3],
                                      [ 0,-2,0, 0,2,6]]);
    });
})
