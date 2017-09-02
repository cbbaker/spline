import React from 'react';

import ContainerDimensions from 'react-container-dimensions';
import {
  Panel,
  Grid,
  Row,
  Col
} from 'react-bootstrap';

import Tile from './Tile';
import Spline from './spline';
import CurveProps from './curveProps';
import Controls from './Controls';

const SVG = (props) => {
  const computeCurveProps = () => {
    const metric = ([x1, y1], [x2, y2]) => {
      const dx = x2 - x1, dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const {document: {pointLists, pointPool}, dragging} = props;
    var {
      curveColor,
      curveWidth,
      tileWidth,
      tileHeight,
      pointRadius,
      pointColor,
      colorMax,
      colorMin
    } = props;
    var bezierSplit = true;
    if (dragging) {
      bezierSplit = false;
      curveColor = "lightgray";
    }

    return pointLists.map(pointList => {
      const points = pointList.map(point => pointPool[point]);
      const spline = new Spline(points, metric);
      const props = new CurveProps(spline, {
        pointList,
        pointPool,
        tileWidth,
        tileHeight,
        pointRadius,
        pointColor,
        ui: true,
        bezierSplit,
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none",
        colorMax,
        colorMin
      });

      return props.props;
    });
  };

  const childProps = Object.assign({curveProps: computeCurveProps()}, props, {ui: true});

  const {width, height, tileWidth, tileHeight} = props;
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

export default (props) => (
  <Grid >
    <Row>
      <Col sm={12} md={8}>
        <Panel>
          <ContainerDimensions>
            { ({width}) => <SVG width={width - 30} height={0.75 * (width - 30)} {...props}/> }
          </ContainerDimensions>
        </Panel>
      </Col>
      <Col sm={4}>
        {props.document && <Controls {...props} />}
      </Col>
    </Row>
  </Grid>
);
