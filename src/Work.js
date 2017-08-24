import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router-dom';
import {
  Panel,
  Grid,
  Row,
  Col,
  Alert
} from 'react-bootstrap';

import Tile from './Tile';

import Spline from './spline';
import CurveProps from './curveProps';
import Controls from './Controls';

class Work extends Component {
  componentWillMount() {
    this.init(this.props, this.state);
  }

  componentWillUpdate(nextProps, nextState) {
    this.init(nextProps, nextState);
  }

  init(nextProps, nextState) {
    const {match: {params: {id}}, store, history, findDocument} = nextProps;
    if (id === 'new') {
      const document = store.newDocument();
      store.saveDocument(document.id, document);
      history.replace('/documents/' + document.id);
    } else {
      findDocument(parseInt(id, 10));
    }
  }

  componentDidMount() {
    this.computeTmpPt();
  }

  computeTmpPt() {
    const svg = ReactDOM.findDOMNode(this.refs.svg);
    if (this.props.setTmpPt && svg && svg.createSVGPoint) {
      const tmpPt = svg.createSVGPoint();
      if (tmpPt) {
        this.props.setTmpPt(tmpPt);
      }
    }
  }

  metric([x1, y1], [x2, y2]) {
    const dx = x2 - x1, dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  computeCurveProps() {
    const {document: {pointLists, pointPool}, dragging} = this.props;
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
    var bezierSplit = true;
    if (dragging) {
      bezierSplit = false;
      curveColor = "lightgray";
    }

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
  }

  render() {
    if (!this.props.document) {
      return (<Grid><Alert bsStyle='danger'>Document not found.</Alert></Grid>);
    }

    let props = {
      curveProps: this.computeCurveProps()
    };

    const childProps = Object.assign(props, this.state, this.props, {ui: true});

    const {width, height} = this.props;
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

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: undefined
    };
    this.computeContainerWidth = this.computeContainerWidth.bind(this);
  }

  componentDidMount() {
    this.computeContainerWidth();
    // window.addEventListener('resize', this.computeContainerWidth); // not working--cbb 2017-08-23
  }

  componentWillUnmount() {
    // window.removeEventListener('resize', this.computeContainerWidth);
  }

  componentDidUpdate() {
    this.computeContainerWidth();
  }

  computeContainerWidth() {
    const {width} = this.state;
    const panel = ReactDOM.findDOMNode(this.refs.panel);
    if (panel) {
      const newWidth = panel.clientWidth - 30;
      if (width !== newWidth) {
        this.setState({width: newWidth});
      }
    }
  }

  render() {
    const {width} = this.state;
    if (width) {
      const height = 0.75 * width;

      return (
        <Grid >
          <Row>
            <Col sm={12} md={8}>
              <Panel>
                <Work width={width} height={height} {...this.props}/>
              </Panel>
            </Col>
            <Col sm={4}>
              <Controls {...this.props} />
            </Col>
          </Row>
        </Grid>
      );
    } else {
      return (
        <Grid >
          <Row>
            <Col sm={12} md={8}>
              <Panel ref="panel">
              </Panel>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

export default withRouter(Container);
