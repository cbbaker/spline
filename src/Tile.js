import React, {Component} from 'react';
import Curve from './Curve';

export default class Tile extends Component {
  render() {
    const {curveProps,
           outlineWidth,
           outlineColor,
           tileWidth,
           tileHeight,
           transform,
           ui
          } = this.props;

    const curves = curveProps.map((props, listIdx) => {
      const onMouseDown = (idx) => this.props.onMouseDown({point: [listIdx, idx], g: this.refs.g});
      return (<Curve key={listIdx} listIdx={listIdx} onMouseDown={onMouseDown} {...props} />);
    });

    const rectProps = {
      width: tileWidth,
      height: tileHeight,
      style: {
        stroke: outlineColor,
        strokeWidth: outlineWidth,
        fill: "none"
      }
    };
    
    const rectComp = ui && (<rect {...rectProps} />);

    return (
      <g ref="g" {...{transform}}>
        {rectComp}
        {curves}
      </g>
    );
  }
};

