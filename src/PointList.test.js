import Polynomial from './polynomial';
import PointList from './PointList';

const points = [[0, 0.25], [0.5, 0.65], [1, 0.25]];

describe("PointList", () => {
  test("can create a PointList", () => {
    expect(new PointList(points).points).toEqual(points);
  });

  test("polynomials computes the spline polynomials ", () => {
    const [xPolys, yPolys] = new PointList(points).polynomials();
    expect(xPolys).toEqual([new Polynomial([0, 0.5, 0, 0]),
                            new Polynomial([0.5, 0.5, 0,0 ])]);
    expect(yPolys).toEqual([new Polynomial([0.25, 0, 1.2000000000000002, -0.8]),
                            new Polynomial([0.65, 0, -1.2000000000000002, 0.8])]);
  });

  test("controlPoints computes the spline control points", () => {
    const [[[x00, x01, x02, x03], [x10, x11, x12, x13]],
           [[y00, y01, y02, y03], [y10, y11, y12, y13]]] = new PointList(points).controlPoints();
    expect(x00).toBeCloseTo(0, 5);
    expect(x01).toBeCloseTo(1/6, 5);
    expect(x02).toBeCloseTo(1/3, 5);
    expect(x03).toBeCloseTo(1/2, 5);
    expect(x10).toBeCloseTo(1/2, 5);
    expect(x11).toBeCloseTo(2/3, 5);
    expect(x12).toBeCloseTo(5/6, 5);
    expect(x13).toBeCloseTo(1, 5);
    expect(y00).toBeCloseTo(1/4, 5);
    expect(y01).toBeCloseTo(1/4, 5);
    expect(y02).toBeCloseTo(13/20, 5);
    expect(y03).toBeCloseTo(13/20, 5);
    expect(y10).toBeCloseTo(13/20, 5);
    expect(y11).toBeCloseTo(13/20, 5);
    expect(y12).toBeCloseTo(1/4, 5);
    expect(y13).toBeCloseTo(1/4, 5);
  });

  test("flattenedControlPoints computes the spline control points in a flat list", () => {
    const [[x0, y0], [x1, y1], [x2, y2],
           [x3, y3], [x4, y4], [x5, y5],
           [x6, y6]] = new PointList(points).flattenedControlPoints();

    expect(x0).toBeCloseTo(0, 5);
    expect(x1).toBeCloseTo(1/6, 5);
    expect(x2).toBeCloseTo(1/3, 5);
    expect(x3).toBeCloseTo(1/2, 5);
    expect(x4).toBeCloseTo(2/3, 5);
    expect(x5).toBeCloseTo(5/6, 5);
    expect(x6).toBeCloseTo(1, 5);
    expect(y0).toBeCloseTo(1/4, 5);
    expect(y1).toBeCloseTo(1/4, 5);
    expect(y2).toBeCloseTo(13/20, 5);
    expect(y3).toBeCloseTo(13/20, 5);
    expect(y4).toBeCloseTo(13/20, 5);
    expect(y5).toBeCloseTo(1/4, 5);
    expect(y6).toBeCloseTo(1/4, 5);
  });

  test("movePoint modifies the specified point", () => {
    var pointList = new PointList(points);
    expect(pointList.points[1]).toEqual([0.5, 0.65]);
    pointList.movePoint(1, [0.4, 0.7]);
    expect(pointList.points[1]).toEqual([0.4, 0.7]);
  });
});

