import React from 'react';

export default ({x, y, radius, color, onMouseDown}) => (
  <circle onMouseDown={onMouseDown} cx={x} cy={y} r={radius} fill={color} />
);
