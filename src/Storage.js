import React from 'react';
import {
  Grid,
  Panel,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

export default ({store}) => {
  const makeItem = (key, value) => (<ListGroupItem header={key}>{value}</ListGroupItem>);
  const children = store.map(makeItem);

  return (
    <Grid>
      <Panel header={<h3>local storage</h3>}>
        <ListGroup>{children}</ListGroup>
      </Panel>
    </Grid>
  );
};
