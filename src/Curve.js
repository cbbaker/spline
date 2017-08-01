import React from 'react';
import Point from './Point';

export default (props) => {
  const {pointList, ui, width, height, pointRadius, pointColor, listIdx, onMouseDown, d, stroke, strokeWidth, fill } = props;
  
  const pointControls = ui && pointList.points.map(([x, y], pointIdx) => {
    return (
      <Point x={x*width} y={y*height}
             radius={pointRadius} color={pointColor} 
             onMouseDown={e => onMouseDown(pointIdx, e)}
             key={"[" + listIdx + "," + pointIdx + "]"}
             />
    );
  });

  const pathProps = {d, stroke, strokeWidth, fill};

  return (
    <g>
      <path {...pathProps} />
      {pointControls}
    </g>
  );
};
