import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {
  ListGroup,
  ListGroupItem,
  Panel,
  Grid,
  Media,
  Button,
  Glyphicon
} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

import Tile from './Tile';
import Spline from './spline';
import CurveProps from './curveProps';

export default class List extends Component {
  computeCurveProps({pointLists, pointPool}) {
    const metric = ([x1, y1], [x2, y2]) => {
      const dx = x2 - x1, dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const {
      curveColor,
      curveWidth,
      tileWidth,
      tileHeight,
      pointRadius,
      pointColor
    } = this.props;

    return pointLists.map(pointList => {
      const points = pointList.map(point => pointPool[point]);
      const spline = new Spline(points, metric);
      const props = new CurveProps(spline, {
        pointList,
        tileWidth,
        tileHeight,
        pointRadius,
        pointColor,
        bezierSplit: true,
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none"
      });

      return props.props;
    });
  }

  render() {
    const {documents, tileWidth, tileHeight} = this.props;
    const children = (documents).map((doc) => {
      var tileProps = {
        curveProps: this.computeCurveProps(doc)
      };

      const createdAt = new Date(doc.createdAt), updatedAt = new Date(doc.updatedAt);

      return (
        <ListGroupItem key={doc.id}>
          <Media>
            <Media.Left>
              <LinkContainer to={'/documents/' + doc.id}>
                <svg width={tileWidth} height={tileHeight}>
                  <Tile {...tileProps}/>
                  <rect width={tileWidth} height={tileHeight} stroke="black" fill="none"/>
                </svg>
              </LinkContainer>
            </Media.Left>
            <Media.Body>
              <Button className="pull-right" bsStyle="danger"
                      onClick={() => this.props.removeDocument(doc.id)}>
                <Glyphicon glyph="trash" />
              </Button>
              
              <p><b>Name:</b> {doc.name ? doc.name : <i>untitled</i>}</p>
              <p><b>Created at:</b> {createdAt.toLocaleDateString()} {createdAt.toLocaleTimeString()}</p>
              <p><b>Updated at:</b> {updatedAt.toLocaleDateString()} {updatedAt.toLocaleTimeString()}</p>
            </Media.Body>
          </Media>
        </ListGroupItem>
      );
    });

    return (
      <Grid>
        <Panel header={<h3>Splines:</h3>}>
          <ListGroup>
            <ListGroupItem key="new">
              <Link to='/documents/new'>
                <Button bsStyle="default" bsSize="large">Create random</Button>
              </Link>
            </ListGroupItem>
            {children}
          </ListGroup>
        </Panel>
      </Grid>
    );
  }
}
