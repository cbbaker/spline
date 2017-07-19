import React, { Component } from 'react';

export default ({controlPoints,
                 curveWidth,
                 curveColor,
                 outlineWidth,
                 outlineColor,
                 width,
                 height,
                 transform}) => {
  const rectStyle = {
    stroke: outlineColor,
    strokeWidth: outlineWidth,
    fill: "none"
  };

  const rectProps = {width, height, style: rectStyle};

  const pathDescription = (controlPoints) => {
    const [x1, y1] = controlPoints[0];
    var result = "M " + x1 + "," + y1;
    for (var i = 1; i < controlPoints.length; i += 3) {
      const [x2, y2] = controlPoints[i];
      const [x3, y3] = controlPoints[i+1];
      const [x4, y4] = controlPoints[i+2];
      result += " C " + x2 + "," + y2 + " " + x3 + "," + y3 + " " + x4 + "," + y4;
    }

    return result;
  };

  const curveProps = {
    d: pathDescription(controlPoints),
    stroke: curveColor,
    strokeWidth: curveWidth,
    fill: "none"
  };

  return (
    <g {...{transform}}>
      <rect {...rectProps} />
      <path {...curveProps} />
    </g>
  );
};
