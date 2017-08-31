export default class CurveProps {
  constructor(spline, defaults) {
    this.spline = spline;
    this.props = defaults;
    if (defaults.bezierSplit) {
      this.computePaths();
    } else {
      this.computePath();
    }
  }

  computePaths() {
    const {
      spline,
      props: {
        tileWidth,
        tileHeight,
        colorMin,
        colorMax
      }
    } = this;
    const colorDiffSmall = ({controls: [[x0, y0, c0], p1, p2, [x3, y3, c3]]}) => (Math.abs(c3 - c0) < 0.02);
    const splines = spline.adaptiveSplit(colorDiffSmall);

    const clamp = (value) => {
      const newValue = colorMin + (colorMax - colorMin) * value;
      return Math.max(colorMin, Math.min(240, Math.floor(newValue)));
    };

    this.props.splineProps = splines.map(spline => {
      const [[x0, y0, c0], [x1, y1], [x2, y2], [x3, y3, c3]] = spline.controls;
      return {
        d: `M ${x0 * tileWidth},${y0 * tileHeight} C ${x1 * tileWidth},${y1 * tileHeight} ${x2 * tileWidth},${y2 * tileHeight} ${x3 * tileWidth},${y3 * tileHeight}`,
        strokeOpacity: clamp(0.5 * (c0 + c3)) / 256
      };
    });
  }

  computePath() {
    const {spline, props: {tileWidth, tileHeight}} = this;
    const controlPoints = spline.flattenedControlPoints();
    const [x1, y1] = controlPoints[0];
    var result = "M " + (x1 * tileWidth) + "," + (y1 * tileHeight);
    for (var i = 1; i < controlPoints.length; i += 3) {
      const [x2, y2] = controlPoints[i];
      const [x3, y3] = controlPoints[i+1];
      const [x4, y4] = controlPoints[i+2];
      result += " C " + (x2 * tileWidth) + "," + (y2 * tileHeight)
          + " " + (x3 * tileWidth) + "," + (y3 * tileHeight) + " " + (x4 * tileWidth) + "," + (y4 * tileHeight);
    }

    this.props.d = result;
  }
}
