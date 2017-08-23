import React from 'react';
import ReactDOM from 'react-dom';
import {MemoryRouter} from 'react-router';
import Work from './Work';

it('renders without crashing', () => {
  const div = document.createElement('div');
  const props = {
    findDocument: jest.fn()
  };

  ReactDOM.render(
    <MemoryRouter>
      <Work {...props}/>
    </MemoryRouter>, div
  );
});
