import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router';
import List from './List';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    store: {
      listDocuments: () => []
    }
  };

  ReactDOM.render(
    <MemoryRouter>
      <List {...props}/>
    </MemoryRouter>, div
  );
});
