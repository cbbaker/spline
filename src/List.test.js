import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router';
import List from './List';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    listDocuments: jest.fn(),
    documents: []
  };

  ReactDOM.render(
    <MemoryRouter>
      <List {...props}/>
    </MemoryRouter>, div
  );
});
