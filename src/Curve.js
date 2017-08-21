import React from 'react';
import Point from './Point';

export default ({
  pointList, pointPool, ui, width, height, pointRadius, pointColor, listIdx,
  onMouseDown, d, stroke, strokeWidth, fill, splinePoints 
}) => {
  
  const pointControls = ui && pointList.map((offset, pointIdx) => {
    const [x, y] = pointPool[offset];
    return (
      <Point x={x*width} y={y*height}
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
    for(var i = 1; i < splinePoints.length; i++) {
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
    
  }
};
