import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FullScreen from 'react-fullscreen';
import Tile from './Tile';

import Spline from './spline';
import CurveProps from './curveProps';

class Preview extends Component {
  componentWillMount() {
    this.init(this.props, this.state);
    console.log("DEBUG: this.props.document: " + this.props.document);
  }

  componentWillUpdate(nextProps, nextState) {
    this.init(nextProps, nextState);
    console.log("DEBUG: this.props.document: " + this.props.document);
  }

  init(nextProps, nextState) {
    const {match: {params: {id}}, findDocument} = nextProps;
    findDocument(parseInt(id, 10));
  }

  metric([x1, y1], [x2, y2]) {
    const dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  computeCurveProps() {
    const {document: {pointLists, pointPool}} = this.props;
    var {
      curveColor,
      curveWidth,
      tileWidth,
      tileHeight,
      pointRadius,
      pointColor,
      colorMax,
      colorMin
    } = this.props;

    return pointLists.map(pointList => {
      const points = pointList.map(point => pointPool[point]);
      const spline = new Spline(points, this.metric);
      const props = new CurveProps(spline, {
        pointList,
        pointPool,
        tileWidth,
        tileHeight,
        pointRadius,
        pointColor,
        ui: false,
        bezierSplit: true,
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
    if (!this.props.document) {
      return (<div></div>);
    }

    let props = {
      curveProps: this.computeCurveProps()
    };

    const childProps = Object.assign(props, this.state, this.props, {ui: false});

    const {width} = this.props;
    const height = 0.75 * width;
    const {tileWidth, tileHeight} = this.props;
    const hCount = Math.ceil(width / tileWidth),
          vCount = Math.ceil(height / tileHeight);
    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (
        <Tile key={trans} transform={trans} {...childProps} />
      );
    };

    var children = [];
    for (var y = 0; y < vCount; ++y) {
      for (var x = 0; x < hCount; ++x) {
        children.push(tileAt(x * tileWidth, y * tileHeight));
      }
    }

    return (
      <svg width={width} height={height} ref="svg">
        <rect width={width} height={height} stroke="black" fill="none" />
        {children}
      </svg>
    );
  }
}

class Full extends Component {
  componentDidMount() {
    const screen = ReactDOM.findDOMNode(this.refs.screen);
    if (screen && screen.requestFullScreen) {
      screen.requestFullScreen();
    }
  }

  render() {
    return (
      <FullScreen ref="screen">
        <Preview {...this.props}/>
      </FullScreen>
    );
  }
}

export default Full;
