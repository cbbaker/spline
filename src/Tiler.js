import React, {Component} from 'react';

import ContainerDimensions from 'react-container-dimensions';
import {
  Panel,
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import Preview from './Preview';
import Tile from './Tile';
import Spline from './spline';
import CurveProps from './curveProps';
import Controls from './Controls';

class Tiler extends Component {
  constructor(props){
    super(props);
    this.state = this.computeState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.setState(this.computeState(nextProps));
    }
  }

  computeState(props) {
    const metric = ([x1, y1], [x2, y2]) => {
      const dx = x2 - x1, dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const {document: {pointLists, pointPool}, dragging, selection} = props;
    var {
      curveColor,
      curveWidth,
      tileWidth,
      tileHeight,
      pointRadius,
      pointColor
    } = props;

    var bezierSplit = true;
    if (dragging) {
      bezierSplit = false;
      curveColor = "lightgray";
    }

    const curveProps = pointLists.map(pointList => {
      const points = pointList.map(point => pointPool[point]);
      const spline = new Spline(points, metric);
      const props = new CurveProps(spline, {
        selection,
        pointList,
        pointPool,
        tileWidth,
        tileHeight,
        pointRadius,
        pointColor,
        bezierSplit,
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none"
      });

      return props.props;
    });

    return {curveProps};
  }

  render() {
    if (this.props.preview) {
      return (<Preview {...this.state} {...this.props}/>);
    } else {
      return (<Normal {...this.state} {...this.props}/>);
    }
  }
};

class Normal extends Component {
  render() {
    const childProps = Object.assign({}, this.state, this.props, {ui: true});

    const {width, height, tileWidth, tileHeight} = this.props;
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
      <svg width={width} height={height}>
	      <rect width={width} height={height} stroke="black" fill="none" />
	      {children}
      </svg>
    );
  };
};


export default (props) => (
  <Grid onMouseDown={props.onMouseDownOther}>
    <Row>
      <Col sm={12} md={8}>
        <Panel>
          <ContainerDimensions>
            { ({width}) => <Tiler width={width - 30} height={0.75 * (width - 30)} {...props}/> }
          </ContainerDimensions>
        </Panel>
      </Col>
      <Col sm={4}>
        <Controls {...props} />
      </Col>
    </Row>
  </Grid>
);
