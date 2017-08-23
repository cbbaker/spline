import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router';
import Preview from './Preview';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    match: {
      params:{
        id: 3
      }
    },
    findDocument: jest.fn()
  };

  ReactDOM.render(
    <MemoryRouter>
      <Preview {...props}/>
    </MemoryRouter>, div
  );
});
