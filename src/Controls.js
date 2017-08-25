import React, {Component} from 'react';
import {
  Panel,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';

export default class Controls extends Component {
  render () {
    const onNameChanged = (e) => {
      this.props.updateDocumentName(e.target.value);
    };
    return (
      <Panel>
        <form>
          <FormGroup controlId='documentName'>
            <ControlLabel>Name</ControlLabel>
            <FormControl onChange={onNameChanged}
              type='text' value={this.props.document.name} />
          </FormGroup>
        </form>
        <LinkContainer to={`/documents/${this.props.match.params.id}/preview`}>
          <Button bsStyle='default'>Preview</Button>
        </LinkContainer>
      </Panel>
    );
  }
}
