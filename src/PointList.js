import {computePolynomials} from './spline';

export default class PointList {
  constructor(points) {
    this.points = points;
  }

  polynomials() {
    return computePolynomials(this.points);
  }

  controlPoints() {
    return computePolynomials(this.points).map(coord => {
      return coord.map(poly => poly.toControlPoints());
    });
  }

  flattenedControlPoints() {
    const [xControls, yControls] = this.controlPoints();

    var result = [];
    for (var i = 0; i < xControls.length; ++i) {
      result.push([xControls[i][0], yControls[i][0]]);
      result.push([xControls[i][1], yControls[i][1]]);
      result.push([xControls[i][2], yControls[i][2]]);
    }
    result.push([xControls[xControls.length - 1][3], yControls[xControls.length - 1][3]]);

    return result;
  }

  movePoint(index, newPoint) {
    this.points[index][0] = newPoint[0];
    this.points[index][1] = newPoint[1];
  }
};
