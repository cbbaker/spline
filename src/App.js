import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './App.css';

import PointList from './PointList';
import Tile from './Tile';

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props.pointLists);
    this.state = {
      pointLists: props.pointLists,
      ui: true
    };
  }

  componentDidMount() {
    const svg = ReactDOM.findDOMNode(this.refs.svg);
    if (svg && svg.createSVGPoint) {
      const tmpPt = svg.createSVGPoint();
      if (tmpPt) {
        this.setState({tmpPt});
      }
    }
    $(document).keypress((e) => {
      if (e.which === 32) {
        e.preventDefault();
        this.setState({ui: !this.state.ui});
      }
    });
  }

  movePoint([list, index], [newX, newY]) {
    const {width, height} = this.props;
    
    var {pointLists} = this.state;
    var pointList = pointLists[list];
      var points = pointList.points;
    var [oldX, oldY] = points[index];

    if (index === 0 || index === points.length - 1) {
      if (oldX === 0) {
        var y = newY / height;
        pointList.movePoint(0, [0, y]);
        pointList.movePoint(points.length - 1, [1, y]);
      } else if (oldY === 0) {
        var x = newX / width;
        pointList.movePoint(0, [x, 0]);
        pointList.movePoint(points.length - 1, [x, 1]);
      }
    } else {
      pointList.movePoint(index, [newX / width, newY / height]);
    }

    this.setState({pointLists});
  }

  pathDescription(controlPoints) {
    const {width, height} = this.props;
    const [x1, y1] = controlPoints[0];
    var result = "M " + (x1 * width) + "," + (y1 * height);
    for (var i = 1; i < controlPoints.length; i += 3) {
      const [x2, y2] = controlPoints[i];
      const [x3, y3] = controlPoints[i+1];
      const [x4, y4] = controlPoints[i+2];
      result += " C " + (x2 * width) + "," + (y2 * height)
          + " " + (x3 * width) + "," + (y3 * height) + " " + (x4 * width) + "," + (y4 * height);
    }

    return result;
  }

  computeCurveProps() {
    const {pointLists, ui} = this.state;
    const {curveColor, curveWidth, width, height, pointRadius, pointColor} = this.props;
    return pointLists.map(pointList => {
      const controlPoints = pointList.flattenedControlPoints();
      return {
        pointList,
        width,
        height,
        pointRadius,
        pointColor,
        ui,
        d: this.pathDescription(controlPoints),
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none"
      };
    });
  }

  render() {
    const {width, height} = this.props;
    var tileProps = Object.assign({movePoint: this.movePoint.bind(this)}, this.state, this.props);

    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (
        <Tile key={trans} transform={trans} curveProps={this.computeCurveProps()} {...tileProps} />
      );
    };

    var children = [];
    for (var y = 0; y < 3; ++y) {
      for (var x = 0; x < 4; ++x) {
        children.push(tileAt(10 + x * width, 10 + y * height));
      }
    }

    return (
      <svg ref="svg" width="1280" height="960">
        {children}
      </svg>
    );
  }
};

// function makePointLists() {
//   const start = [0, 0.25];
//   const end = [1, start[1]];
//   const int1 = [[0.4, 0.25], [0.6, 0.75]];
//   const int2 = [int1[1], int1[0]];
//   return [int1, int2].map(i => new PointList([start].concat(i).concat([end])));
// }

// function makePointLists() {
//     const int = [[0.4, 0.25], [0.6, 0.25], [0.6, 0.75]];
//     return [[0, 0.75], [0.25, 0]].map(start => {
//         const end = start[0] === 0 ? [1, start[1]] : [start[0], 1];
//         return new PointList([start].concat(int).concat([end]));
//     });
// }

function makePointLists() {
    const n = 4;
    const x0 = Math.random();
    const y0 = Math.random();
    var int = [];
    for (var i = 0; i < n; ++i) {
        int.push([Math.random(), Math.random()]);
    }
    return [[0, y0], [x0, 0]].map(start => {
        const end = start[0] === 0 ? [1, start[1]] : [start[0], 1];
        return new PointList([start].concat(int).concat([end]));
    });
}

App.defaultProps = {
  width: 256,
  height: 256,
  outlineWidth: 1,
  outlineColor: "rgb(200,200,200)",
  curveWidth: 2,
  curveColor: "rgb(16,16, 16)",
  pointRadius: 5,
  pointColor: "rgb(100,200,200)",
  // pointLists: [new PointList([[0, 0.25], [0.5, 0.65], [0.3, 0.75], [0.4, 0.25], [1, 0.25]]),
  //              new PointList([[0.25, 0], [0.3, 0.75], [0.5, 0.65], [0.9, 0.75], [0.25, 1]])]
  pointLists: makePointLists()
};

export default App;
