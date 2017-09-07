import React from 'react';
import Point from './Point';

export default ({
  pointList, pointPool, ui, tileWidth, tileHeight, pointRadius, pointColor, listIdx,
  onMouseDownPoint, d, stroke, strokeWidth, fill, splinePoints, splineProps, selection
}) => {
  var i;
  const pointControls = ui && pointList.map((offset, pointIdx) => {
    const [x, y] = pointPool[offset];
    let radius = pointRadius;
    if (selection !== undefined
        && selection.type === "point"
        && selection.which[0] === listIdx
        && selection.which[1] === pointIdx) {
      radius *= 1.5;
    }
    const onMouseDown = (e) => {
      e.stopPropagation();
      return onMouseDownPoint({type: "point", which: [listIdx, pointIdx]});
    };
    return (
      <Point x={x*tileWidth} y={y*tileHeight}
             radius={radius} color={pointColor} 
             onMouseDown={onMouseDown}
             key={"[" + listIdx + "," + pointIdx + "]"}
             />
    );
  });

  if (d !== undefined) {
    const pathProps = {d, stroke, strokeWidth, fill};

    return (
      <g>
        <path {...pathProps} />
        {pointControls}
      </g>
    );
  } else if (splinePoints !== undefined) {
    var lines = [];
    for(i = 1; i < splinePoints.length; i++) {
      let [x1, y1] = splinePoints[i-1], [x2, y2, c2] = splinePoints[i];
      const lineProps = {
        key: i,
        x1, y1, x2, y2,
        stroke: "black",
        strokeWidth,
        strokeOpacity: c2 / 256
      };
      
      lines.push(<line {...lineProps} />);
    }

    return (
      <g>
        {lines}
        {pointControls}
      </g>
    );
    
  } else if (splineProps !== undefined) {
    const splines = splineProps.map((splineProp, index) => (
      <path key={index} strokeWidth={strokeWidth} fill={fill} stroke={stroke} {...splineProp}/>
    ));

    return (
      <g>
        {splines}
        {pointControls}
      </g>
    );
  }
};
