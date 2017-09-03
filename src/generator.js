export default class Generator {
  constructor({pointCount, horizontalSplineCount, verticalSplineCount}) {
    this.pointCount = pointCount || 0;
    this.horizontalSplineCount = horizontalSplineCount || 0;
    this.verticalSplineCount = verticalSplineCount || 0;
  }

  generate(store) {
    var pointPool = [];
    for (let i = 0; i < this.verticalSplineCount; ++i) {
      const x = Math.random(), c = Math.random();
      pointPool.push([x, 0, c]);
      pointPool.push([x, 1, c]);
    }

    const verticalOffset = pointPool.length;

    for (let i = 0; i < this.horizontalSplineCount; ++i) {
      const y = Math.random(), c = Math.random();
      pointPool.push([0, y, c]);
      pointPool.push([1, y, c]);
    }

    const internalOffset = pointPool.length;

    var int = [];
    for (var i = 0; i < this.pointCount; ++i) {
      pointPool.push([Math.random(), Math.random(), Math.random()]);
      int.push(i+internalOffset);
    }

    var pointLists = [];

    for (let i = 0; i < this.verticalSplineCount; ++i) {
      pointLists.push([i * 2].concat(int).concat([i * 2 + 1]));
    }
  
    for (let i = 0; i < this.horizontalSplineCount; ++i) {
      pointLists.push([i * 2 + verticalOffset].concat(int).concat([i * 2 + 1 + verticalOffset]));
    }

    return {
      id: store.nextId(),
      pointLists,
      pointPool
    };
  }
};
