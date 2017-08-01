import React from 'react';

export default ({x, y, radius, color, onMouseDown, onTouchStart}) => {
  return (
    <circle onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            cx={x} cy={y} r={radius} fill={color} />
  );
};
