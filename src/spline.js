import math from 'mathjs';
import _ from 'lodash';
import Polynomial from './polynomial';
import Section from './section';

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

export default class Spline {
  constructor(points, metric) {
    this.points = points;
    this.metric = metric;
    this.sections = this.computeSections(this.points, this.metric);
  }

  computeSections(points, metric) {
    const transposed = this.computePolynomials(points, metric).map(coord => {
      return coord.map(poly => poly.toControlPoints());
    });

    var result = [];
    for (var section = 0; section < transposed[0].length; ++section) {
      var controls = [];
      for (var control = 0; control < 4; ++control) {
        var point = [];
        for (var coord = 0; coord < transposed.length; ++coord){
          point.push(transposed[coord][section][control]);
        }
        controls.push(point);
      }
      result.push(new Section(controls));
    }

    return result;
  }

  computePolynomials(points, metric) {
    const splineCount = points.length - 1;
    var knots = [];
    for (var i = 0; i < splineCount; ++i) {
      knots.push(metric(points[i], points[i + 1]));
    }
    const dim = splineCount * 3;
    const matrix = this.createMatrix(knots);
    const invMatrix = math.inv(matrix);
    const coefficientMatrix = math.subset(invMatrix, math.index(math.range(0, dim), math.range(0, dim, 3)));

    const coords = math.transpose(points);
    return coords.map(coord => this.coefficientHelper(coefficientMatrix, knots, coord));
  }

  createMatrix(knots) {
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
  }

  coefficientHelper(matrix, knots, values) {
    const splineCount = values.length - 1;
    const deltaVs = this.deltas(values);
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
  }

  deltas(array) {
    const length = array.length;
    const end = math.subset(array, math.index(math.range(1, length)));
    const start = math.subset(array, math.index(math.range(0, length -1)));
    return math.subtract(end, start);
  };

  flattenedControlPoints() {
    var result = [];
    for(var i = 0; i < this.sections.length; i++) {
      const controls = this.sections[i].controls;
      result.push(controls[0]);
      result.push(controls[1]);
      result.push(controls[2]);
    }
    result.push(this.sections[this.sections.length - 1].controls[3]);

    return result;
  }

  split(iterations) {
    return _.flatMap(this.sections, section => section.split(iterations));
  }

  adaptiveSplit(condition) {
    return _.flatMap(this.sections, section => section.adaptiveSplit(condition));
  }

  flattenedPoints(iterations) {
    const sections = this.split(iterations);
    return sections.map(section => section.controls[0]).concat([sections[sections.length - 1].controls[3]]);
  }
}
