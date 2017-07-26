import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {computePolynomials} from './spline';
import Point from './Point';
import $ from 'jquery';


export default class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {dragging: null};
    this.onMouseMove = this.mouseMoveHandler.bind(this);
    this.onMouseUp = this.mouseUpHandler.bind(this);
  }

  onMouseDown(list, index, e) {
    this.setState({dragging: [list, index]});
    $(document).mousemove(this.onMouseMove);
    $(document).mouseup(this.onMouseUp);
  }

  mouseMoveHandler(e) {
    var g = ReactDOM.findDOMNode(this.refs.g);
    var {tmpPt, movePoint} = this.props;
    if (g && tmpPt && this.state.dragging !== null) {
      tmpPt.x = e.clientX;
      tmpPt.y = e.clientY;
      var local = tmpPt.matrixTransform(g.getScreenCTM().inverse());
      movePoint(this.state.dragging, [local.x, local.y]);
    }
  }

  mouseUpHandler(e) {
    this.setState({dragging: null});
    $(document).unbind('mousemove', this.onMouseMove);
    $(document).unbind('mouseup', this.onMouseUp);
  }


  computeControls(points) {
    const {width, height} = this.props;
    const scaled = points.map(([x, y]) => {
      return [x * width, y * height];
    });

    const [xPolynomials, yPolynomials] = computePolynomials(scaled);
    const xControls = xPolynomials.map(poly => poly.toControlPoints()),
          yControls = yPolynomials.map(poly => poly.toControlPoints());


    var result = [];
    for (var i = 0; i < xControls.length; ++i) {
      result.push([xControls[i][0], yControls[i][0]]);
      result.push([xControls[i][1], yControls[i][1]]);
      result.push([xControls[i][2], yControls[i][2]]);
    }
    result.push([xControls[xControls.length - 1][3], yControls[xControls.length - 1][3]]);

    return result;
  }

  pathDescription(controlPoints) {
    const [x1, y1] = controlPoints[0];
    var result = "M " + x1 + "," + y1;
    for (var i = 1; i < controlPoints.length; i += 3) {
      const [x2, y2] = controlPoints[i];
      const [x3, y3] = controlPoints[i+1];
      const [x4, y4] = controlPoints[i+2];
      result += " C " + x2 + "," + y2 + " " + x3 + "," + y3 + " " + x4 + "," + y4;
    }

    return result;
  }


  render() {
    const {pointLists,
           curveWidth,
           curveColor,
           outlineWidth,
           outlineColor,
           pointRadius,
           pointColor,
           width,
           height,
           transform
          } = this.props;

    const controlPointLists = pointLists.map((points) => this.computeControls(points));

    const rectStyle = {
      stroke: outlineColor,
      strokeWidth: outlineWidth,
      fill: "none"
    };

    const rectProps = {width, height, style: rectStyle};

    const paths = controlPointLists.map((controlPoints, list) => {
      const curveProps = {
        d: this.pathDescription(controlPoints),
        stroke: curveColor,
        strokeWidth: curveWidth,
        fill: "none"
      };

      const pointControls = pointLists[list].map(([x, y], index) => {
        if (this.props.ui) {
          return (
            <Point x={x*width} y={y*height}
                   radius={pointRadius} color={pointColor} 
                   onMouseDown={this.onMouseDown.bind(this, list, index)}
                   key={"[" + list + "," + index + "]"}
                   />
          );
        } else {
          return undefined;
        }
      });
      
      return (
        <g>
          <path {...curveProps} />
          {pointControls}
        </g>
      );
    });
    
    const rectComp = this.props.ui && (<rect {...rectProps} />);

    return (
      <g ref="g" {...{transform}}>
        {rectComp}
        {paths}
      </g>
    );
  }
};

