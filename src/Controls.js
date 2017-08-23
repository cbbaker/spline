import React, {Component} from 'react';
import {
  Panel,
  Button
} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default class Controls extends Component {
  render () {
    return (
      <Panel header={<h3>controls</h3>}>
        <LinkContainer to={`/documents/${this.props.match.params.id}/preview`}>
          <Button bsStyle='default'>Preview</Button>
        </LinkContainer>
      </Panel>
    );
  }
}
