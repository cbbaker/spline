import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Panel,
  Grid
} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import Tile from './Tile';
import Spline from './spline';
import CurveProps from './curveProps';

export default (props) => {
  const metric = ([x1, y1], [x2, y2]) => {
    const dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const computeCurveProps = ({pointLists, pointPool}) => {
    const {
      curveColor,
      curveWidth,
      width,
      height,
      pointRadius,
      pointColor,
      colorMax,
      colorMin
    } = props;

    return pointLists.map(pointList => {
      const points = pointList.map(point => pointPool[point]);
      const spline = new Spline(points, metric);
      const props = new CurveProps(spline, {
        pointList,
        width,
        height,
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
  };

  const {width, height} = props;
  const docs = props.store.listDocuments();
  const children = docs.map((doc) => {
    var tileProps = {
      curveProps: computeCurveProps(doc)
    };

    return (
      <ListGroupItem key={doc.id}>
        <LinkContainer to={'/documents/' + doc.id}>
          <svg width={width} height={height}>
            <Tile {...tileProps}/>
            <rect width={width} height={height} stroke="black" fill="none"/>
          </svg>
        </LinkContainer>
      </ListGroupItem>
    );
  });

  return (
    <Grid>
      <Panel header={<h3>Open file:</h3>}>
        <ListGroup>{children}</ListGroup>
      </Panel>
    </Grid>
  );
}
