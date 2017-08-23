import CurveProps from './curveProps';
import Spline from './spline';

const pts = [[0, 0, 0], [1/2, 1/3, 1], [1/2, 2/3, 1], [1, 1, 0]];
function metric([x1, y1], [x2, y2]) {
  const dx = x2 - x1, dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

const spline = new Spline(pts, metric);

describe("CurveProps", () => {
  test("can be constructed", () => {
    const props = new CurveProps(spline, {width: 1, height: 1, stroke: 1});
    expect(props.props).toHaveProperty("stroke", 1);
  });

  test.skip("computes the lines", () => {
    const props = new CurveProps(spline, {width: 1, height: 1, stroke: 1, bezierSplit: true});
    expect(props.props.splinePoints).toHaveLength(13);
  });

  test("computes the spline drawing commands", () => {
    const props = new CurveProps(spline, {width: 1, height: 1, stroke: 1});
    expect(props.props).toHaveProperty("d", "M 0,0 C 0.23190589392038896,0.0761961362686112 0.4638117878407774,0.15239227253722298 0.5,0.3333333333333333 C 0.5200736083857607,0.4337013752621368 0.4799263916142392,0.5662986247378632 0.5,0.6666666666666666 C 0.5361882121592221,0.847607727462777 0.768094106079611,0.9238038637313885 0.9999999999999998,1");
  });

  test("computes the split spline drawing commands", () => {
    const props = new CurveProps(spline, {width: 1, height: 1, stroke: 1, bezierSplit: true});
    expect(props.props.splineProps).toHaveLength(153);
  });
});

