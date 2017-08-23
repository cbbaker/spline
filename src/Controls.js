import React, {Component} from 'react';
import {
  Panel,
  Checkbox,
  FormGroup
} from 'react-bootstrap';

export default class Controls extends Component {
  makeCheckbox() {
    const {ui, setUI} = this.props;
    return <Checkbox checked={ui} onChange={() => setUI(!ui)}>Show grid and points</Checkbox>;
  }

  render () {
    return (
      <Panel header={<h3>controls</h3>}>
        <form>
          <FormGroup>
            {this.makeCheckbox()}
          </FormGroup>
        </form>
      </Panel>
    );
  }
}
