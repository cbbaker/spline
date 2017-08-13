import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './App.css';

import Spline from './spline';
import CurveProps from './curveProps';
import Tile from './Tile';

class App extends Component {
  constructor(props) {
    super(props);
    console.log(props.pointLists);
    this.state = {
      pointLists: props.pointLists,
      ui: false,
      bezierSplit: 5
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
      var {ui, bezierSplit} = this.state;
      switch (e.which) {
      case 32: // space
        e.preventDefault();
        ui = !ui;
        break;
      case 43: // plus
      case 61: // equal
        e.preventDefault();
        if (bezierSplit !== undefined) {
          ++bezierSplit;
        } else {
          bezierSplit = 1;
        }
        break;
      case 45: // minus
        e.preventDefault();
        if (this.state.bezierSplit > 1)
        {
          --bezierSplit;
        } else {
          bezierSplit = undefined;
        }
        break;
      default:
      }
      this.setState({ui, bezierSplit});
    });
  }

  movePoint([list, index], [newX, newY]) {
    const {width, height} = this.props;
    
    var {pointLists} = this.state;
    var points = pointLists[list];
    var [oldX, oldY] = points[index];

    if (index === 0 || index === points.length - 1) {
      if (oldX === 0) {
        var y = newY / height;
        points[0][0] = 0;
        points[0][1] = y;
        points[points.length - 1][0] = 1;
        points[points.length - 1][1] = y;
      } else if (oldY === 0) {
        var x = newX / width;
        points[0][0] = x;
        points[0][1] = 0;
        points[points.length - 1][0] = x;
        points[points.length - 1][1] = 1;
      }
    } else {
      points[index][0] = newX / width;
      points[index][1] = newY / height;
    }

    this.setState({pointLists});
  }

  metric([x1, y1], [x2, y2]) {
    const dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  computeCurveProps() {
    const {pointLists, ui, bezierSplit} = this.state;
    const {
      curveColor,
      curveWidth,
      width,
      height,
      pointRadius,
      pointColor,
      colorMax,
      colorMin
    } = this.props;

    return pointLists.map(pointList => {
      const spline = new Spline(pointList, this.metric);
      const props = new CurveProps(spline, {
        pointList,
        width,
        height,
        pointRadius,
        pointColor,
        ui,
        bezierSplit,
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none",
        colorMax,
        colorMin
      });

      return props.props;
    });
  }

  render() {
    const {width, height} = this.props;
    const props = {
      movePoint: this.movePoint.bind(this),
      curveProps: this.computeCurveProps()
    };
    const tileProps = Object.assign(props, this.state, this.props);

    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (
        <Tile key={trans} transform={trans} {...tileProps} />
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
  const c0 = Math.random();
  var int = [];
  for (var i = 0; i < n; ++i) {
    int.push([Math.random(), Math.random(), Math.random()]);
  }
  return [[0, y0, c0], [x0, 0, c0]].map(start => {
    const end = start[0] === 0 ? [1, start[1], start[2]] : [start[0], 1, start[2]];
    return [start].concat(int).concat([end]);
  });
}

// function makePointLists() {
//   return [[[0, 0, 0], [1/2, 1/3, 1/2], [1/2, 2/3, 1/2], [1, 1, 0]]];
// }

App.defaultProps = {
  width: 256,
  height: 256,
  outlineWidth: 1,
  outlineColor: "rgb(200,200,200)",
  curveWidth: 2,
  curveColor: "rgb(16,16, 16)",
  colorMin: 16,
  colorMax: 220,
  pointRadius: 5,
  pointColor: "rgb(100,200,200)",
  // pointLists: [new PointList([[0, 0.25], [0.5, 0.65], [0.3, 0.75], [0.4, 0.25], [1, 0.25]]),
  //              new PointList([[0.25, 0], [0.3, 0.75], [0.5, 0.65], [0.9, 0.75], [0.25, 1]])]
  pointLists: makePointLists()
};

export default App;
