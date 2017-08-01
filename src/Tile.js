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
      return (<Curve key={listIdx} listIdx={listIdx} onMouseDown={this.onMouseDown.bind(this, listIdx)} {...props} />);
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

