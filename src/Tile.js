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
           ui,
           onMouseDownPoint
          } = this.props;

    const curves = curveProps.map((props, listIdx) => {
      return (
        <Curve key={listIdx}
          listIdx={listIdx}
          onMouseDownPoint={onMouseDownPoint && onMouseDownPoint.bind(null, this.refs.g)}
          {...props} />
      );
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

