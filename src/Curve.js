import React from 'react';
import Point from './Point';

export default ({
  pointList, pointPool, ui, tileWidth, tileHeight, pointRadius, pointColor, listIdx,
  onMouseDown, d, stroke, strokeWidth, fill, splinePoints, splineProps
}) => {
  var i;
  const pointControls = ui && pointList.map((offset, pointIdx) => {
    const [x, y] = pointPool[offset];
    return (
      <Point x={x*tileWidth} y={y*tileHeight}
             radius={pointRadius} color={pointColor} 
             onMouseDown={e => onMouseDown(pointIdx, e)}
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
    const splines = splineProps.map(splineProp => (
      <path strokeWidth={strokeWidth} fill={fill} stroke={stroke} {...splineProp}/>
    ));

    return (
      <g>
        {splines}
        {pointControls}
      </g>
    );
  }
};
