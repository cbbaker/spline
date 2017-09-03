class Store {
  constructor(localStorage) {
    this.localStorage = localStorage;
  }

  nextId() {
    const documentIds = this.documentIds();
    return Math.max(0, ...documentIds) + 1;
  }

  newDocument() {
    const documentIds = this.documentIds();
    const id = Math.max(0, ...documentIds) + 1;

    const n = 4;
    const x0 = Math.random();
    const y0 = Math.random();
    const c0 = Math.random();

    const start1 = [0, y0, c0], end1 = [1, y0, c0],
          start2 = [x0, 0, c0], end2 = [x0, 1, c0];

    var pointPool = [start1, end1, start2, end2];
    const offset = pointPool.length;
    var int = [];

    for (var i = 0; i < n; ++i) {
      pointPool.push([Math.random(), Math.random(), Math.random()]);
      int.push(i+offset);
    }

    const pointLists = [[0].concat(int).concat([1]),
                        [2].concat(int).concat([3])];

    return {id, pointLists, pointPool};
  }
  
  listDocuments(sortFn) {
    const documentIds = this.documentIds();
    var documents = [];
    for(var i = 0; i < documentIds.length; i++) {
      const document = this.localStorage.getItem("document:" + documentIds[i]);
      if (document) {
        documents.push(JSON.parse(document));
      }
    }
    return documents.sort(sortFn);
  }

  findDocument(id) {
    const documentIds = this.documentIds();
    if (documentIds.indexOf(id) >= 0) {
      try {
        return JSON.parse(this.localStorage.getItem("document:" + id));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveDocument(id, document) {
    if (document.createdAt === undefined) {
      document.createdAt = Date.now();
    }
    document.updatedAt = Date.now();
    const documentIds = this.documentIds();
    if (documentIds.indexOf(id) < 0) {
      documentIds.push(id);
      this.localStorage.setItem("documentIds", JSON.stringify(documentIds));
    }

    this.localStorage.setItem("document:" + id, JSON.stringify(document));
  }

  removeDocument(id) {
    const documentIds = this.documentIds();
    const index = documentIds.indexOf(id);
    if ( index >= 0) {
      documentIds.splice(index, 1);
      this.localStorage.setItem("documentIds", JSON.stringify(documentIds));
    }
    this.localStorage.removeItem("document:" + id);
  }

  documentIds() {
    const value = this.localStorage && this.localStorage.getItem("documentIds");
    try {
      return JSON.parse(value) || [];
    } catch (e) {
      return [];
    }
  }

  map(callback) {
    var retval = [];

    for(var i = 0; i < this.localStorage.length; i++) {
      const key = this.localStorage.key(i);
      const value = this.localStorage.getItem(key);
      retval.push(callback(key, value));
    }

    return retval;
  }
};


// function makePointLists() {
//   const start = [0, 0.25];
//   const end = [1, start[1]];
//   const int1 = [[0.4, 0.25], [0.6, 0.75]];
//   const int2 = [int1[1], int1[0]];
//   return [int1, int2].map(i => new PointList([start].concat(i).concat([end])));
// }

// function makePointLists() {
//     const int = [[0.4, 0.25], [0.6, 0.25], [0.6, 0.75]];
//     return [[0, 0.75], [0.25, 0]].map(start => {
//         const end = start[0] === 0 ? [1, start[1]] : [start[0], 1];
//         return new PointList([start].concat(int).concat([end]));
//     });
// }

// function makePointLists() {
//   return [[[0, 0, 0], [1/2, 1/3, 1/2], [1/2, 2/3, 1/2], [1, 1, 0]]];
// }

export default Store;
