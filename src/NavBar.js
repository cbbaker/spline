import React from 'react';
import {Link} from 'react-router-dom';
import {Navbar} from 'react-bootstrap';

export default () => (
  <Navbar collapseOnSelect>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Spline Editor</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
  </Navbar>
);
