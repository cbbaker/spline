import React from 'react';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';
import {Navbar, Nav, NavDropdown, MenuItem} from 'react-bootstrap';

export default ({saveDocument}) => {
  const saveMenuAttribs = saveDocument ? {
    onClick: saveDocument
  } : {
    disabled: true
  };

  return (
    <Navbar collapseOnSelect>
      <Navbar.Header>
        <Navbar.Brand>
          <Link to="/">Spline Editor</Link>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <NavDropdown eventKey={1} title="File" id='fileMenu'>
	          <LinkContainer to="/documents/new" isActive={() => false}>
	            <MenuItem eventKey={1.1}>New</MenuItem>
	          </LinkContainer>
	          <LinkContainer to="/documents" isActive={() => false}>
	            <MenuItem eventKey={1.2}>Open</MenuItem>
	          </LinkContainer>
            <MenuItem eventKey={1.3} {...saveMenuAttribs}>Save</MenuItem>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
