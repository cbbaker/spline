import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router';
import New from './DocumentNew';
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

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    match: {
      params: {
        id: 3
      }
    },
    store: new Store(new MockLocalStorage([]))
  };

  ReactDOM.render(
    <MemoryRouter>
      <New {...props}/>
    </MemoryRouter>, div
  );
});
