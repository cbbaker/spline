import Generator from './generator';

const pointCount = 4;
const horizontalSplineCount = 2;
const verticalSplineCount = 1;

const store = {
  nextId() { return 1; }
}

test("generates a doc", () => {
  const doc = new Generator({pointCount, horizontalSplineCount, verticalSplineCount}).generate(store);
  expect(doc).toHaveProperty("id");
  expect(doc).toHaveProperty("pointLists");
  expect(doc).toHaveProperty("pointPool");
});

test("pointCount controls the number of internal points", () => {
  const doc = new Generator({pointCount, horizontalSplineCount, verticalSplineCount}).generate(store);
  const endPointCount = (horizontalSplineCount + verticalSplineCount) * 2;
  expect(doc.pointPool).toHaveLength(pointCount + endPointCount); 
});

test("horizontalSplineCount controls the number of horizontal splines", () => {
  const doc = new Generator({pointCount, horizontalSplineCount, verticalSplineCount}).generate(store);
  expect(doc.pointLists).toHaveLength(verticalSplineCount + horizontalSplineCount);
});

test("verticalSplineCount controls the number of vertical splines", () => {
  const doc = new Generator({pointCount, horizontalSplineCount, verticalSplineCount}).generate(store);
  expect(doc.pointLists).toHaveLength(verticalSplineCount + horizontalSplineCount);
});

