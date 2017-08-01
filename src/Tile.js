import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Curve from './Curve';
import $ from 'jquery';


export default class Tile extends Component {
  constructor(props) {
    super(props);
    this.state = {dragging: null};
    this.onMouseMove = this.mouseMoveHandler.bind(this);
    this.onMouseUp = this.mouseUpHandler.bind(this);
    this.onTouchMove = this.touchMoveHandler.bind(this);
    this.onTouchEnd = this.touchEndHandler.bind(this);
  }

  onMouseDown(list, index, e) {
    this.setState({dragging: [list, index]});
    $(document).mousemove(this.onMouseMove);
    $(document).mouseup(this.onMouseUp);
  }

  onTouchStart(list, index, e) {
    if (e.originalEvent.touches.length === 1) {
      e.preventDefault();
      this.setState({dragging: [list, index]});
      $(document).touchmove(this.onTouchMove);
      $(document).touchend(this.onTouchEnd);
    }
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

  touchMoveHandler(e) {
    var g = ReactDOM.findDOMNode(this.refs.g);
    var {tmpPt, movePoint} = this.props;
    if (e.originalEvent.touches.length === 1
        && g && tmpPt
        && this.state.dragging !== null) {
      e.preventDefault();
      const touch = e.originalEvent.touches[0];
      tmpPt.x = touch.clientX;
      tmpPt.y = touch.clientY;
      var local = tmpPt.matrixTransform(g.getScreenCTM().inverse());
      movePoint(this.state.dragging, [local.x, local.y]);
    }
  }

  touchEndHandler(e) {
    if (e.originalEvent.touches.length === 0) {
      e.preventDefault();
      $(document).unbind('mousemove', this.onTouchMove);
      $(document).unbind('mouseup', this.onTouchEnd);
    }
  }

  render() {
    const {curveProps,
           outlineWidth,
           outlineColor,
           width,
           height,
           transform,
           ui
          } = this.props;

    const curves = curveProps.map((props, listIdx) => {
      return (
          <Curve key={listIdx} listIdx={listIdx}
                 onMouseDown={this.onMouseDown.bind(this, listIdx)}
                 onTouchStart={this.onTouchStart.bind(this, listIdx)}
                 {...props} />);
    });

    const rectStyle = {
      stroke: outlineColor,
      strokeWidth: outlineWidth,
      fill: "none"
    };

    const rectProps = {width, height, style: rectStyle};
    
    const rectComp = ui && (<rect {...rectProps} />);

    return (
      <g ref="g" {...{transform}}>
        {rectComp}
        {curves}
      </g>
    );
  }
};

