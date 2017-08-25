import Store from './store';

class MockLocalStorage {
  constructor(documents) {
    var documentIds = [];
    this.data = {};

    for(var i = 0; i < documents.length; i++) {
      documentIds.push(i);
      this.data["document:" + i] = JSON.stringify(documents[i]);
    }
    this.data.documentIds = JSON.stringify(documentIds);
  }

  getItem(key) {
    return this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
  }

  removeItem(key) {
    delete this.data[key];
  }
}

describe("Store", () => {
  test("newDocument creates a random document", () => {
    const store = new Store(new MockLocalStorage(["thing1", "thing2"]));
    const document = store.newDocument();
    expect(document).toHaveProperty("id", 2);
    expect(document).toHaveProperty("pointLists");
  });

  test("listDocuments returns a list of persisted documents", () => {
    const store = new Store(new MockLocalStorage(["thing1", "thing2"]));
    expect(store.listDocuments()).toEqual(["thing1", "thing2"]);
  });

  test("findDocument looks up a document by it's id", () => {
    const store = new Store(new MockLocalStorage(["thing1", "thing2"]));
    expect(store.findDocument(1)).toEqual("thing2");
  });

  test("saveDocuments saves the document to local storage", () => {
    const store = new Store(new MockLocalStorage(["thing1", "thing2"]));
    store.saveDocument(3, {stuff: "test"});
    expect(store.listDocuments()).toHaveLength(3);
  });

  test("saveDocument adds createdAt if it's not already there", () => {
    const store = new Store(new MockLocalStorage([]));
    store.saveDocument(3, {stuff: "test"});
    expect(store.findDocument(3)).toHaveProperty("createdAt");
  });

  test("saveDocument doesn't add createdAt if it's already there", () => {
    const store = new Store(new MockLocalStorage([]));
    store.saveDocument(3, {stuff: "test", createdAt: "blah"});
    expect(store.findDocument(3)).toHaveProperty("createdAt", "blah");
  });

  test("saveDocument updates updatedAt", () => {
    const store = new Store(new MockLocalStorage([]));
    store.saveDocument(3, {stuff: "test", updatedAt: "blah"});
    expect(store.findDocument(3).updatedAt).not.toEqual("blah");
  });

  test("removeDocument removes the document from local storage", () => {
    const store = new Store(new MockLocalStorage(["thing1", "thing2"]));
    store.removeDocument(0);
    expect(store.listDocuments()).toHaveLength(1);
  });
});

