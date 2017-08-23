import React, {Component} from 'react';
import Curve from './Curve';
import ReactDOM from 'react-dom';

export default class Tile extends Component {
  componentDidMount() {
    var g = ReactDOM.findDOMNode(this.refs.g);
    this.setState({g});
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
      const onMouseDown = (idx) => this.props.onMouseDown(listIdx, idx, this.state.g);
      return (<Curve key={listIdx} listIdx={listIdx} onMouseDown={onMouseDown} {...props} />);
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

