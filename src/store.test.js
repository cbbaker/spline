import Store from './store';

class MockLocalStorage {
  constructor(documents) {
    var document_ids = [];
    this.data = {};

    for(var i = 0; i < documents.length; i++) {
      document_ids.push(i);
      this.data["document:" + i] = JSON.stringify(documents[i]);
    }
    this.data.document_ids = JSON.stringify(document_ids);
  }

  getItem(key) {
    return this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
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
    store.saveDocument(3, "stuff");
    expect(store.listDocuments()).toHaveLength(3);
  });
});

