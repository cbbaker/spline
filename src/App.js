import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './App.css';

import Tile from './Tile';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pointLists: props.pointLists,
      ui: true
    };
  }

  componentDidMount() {
    const svg = ReactDOM.findDOMNode(this.refs.svg);
    if (svg && svg.createSVGPoint) {
      console.log("svg: " + svg);
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
    var points = pointLists[list];
    var [oldX, oldY] = points[index];

    if (index === 0 || index === points.length - 1) {
      if (oldX === 0) {
        points[0] = [0, newY / height];
        points[points.length - 1] = [1, newY / height];
      } else if (oldY === 0) {
        points[0] = [newX / width, 0];
        points[points.length - 1] = [newX / width, 1];
      }
    } else {
      points[index] = [newX / width, newY / height];
    }

    this.setState({pointLists});
  }

  render() {
    const {width, height} = this.props;
    var tileProps = Object.assign({movePoint: (i, pt) => this.movePoint(i, pt)}, this.state, this.props);

    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (<Tile key={trans} transform={trans} {...tileProps} />);
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

App.defaultProps = {
  width: 256,
  height: 256,
  outlineWidth: 1,
  outlineColor: "rgb(200,200,200)",
  curveWidth: 2,
  curveColor: "rgb(16,16, 16)",
  pointRadius: 5,
  pointColor: "rgb(100,200,200)",
  pointLists: [[[0, 0.25], [0.5, 0.65], [0.3, 0.75], [0.4, 0.25], [1, 0.25]],
               [[0.25, 0], [0.3, 0.75], [0.5, 0.65], [0.9, 0.75], [0.25, 1]]]
};

export default App;
