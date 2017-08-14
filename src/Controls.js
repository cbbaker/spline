import React, {Component} from 'react';
import {
  Panel,
  Checkbox,
  FormGroup,
  ButtonGroup,
  Button,
  ControlLabel,
  Glyphicon
} from 'react-bootstrap';

export default class Controls extends Component {
  makeCheckbox() {
    const {ui, setUI} = this.props;
    return <Checkbox checked={ui} onChange={() => setUI(!ui)}>Show grid and points</Checkbox>;
  }

  makeBezierControl() {
    const {bezierSplit, setBezierSplit} = this.props;
    const inc = () => {
      setBezierSplit(bezierSplit + 1);
    };
    const dec = () => {
      setBezierSplit(Math.max(bezierSplit - 1, 1));
    };
    if (bezierSplit !== undefined) {
      return ([
        <Checkbox checked onChange={() => setBezierSplit(undefined)}>Subdivide curves</Checkbox>,
        <ControlLabel>Subdivision level:</ControlLabel>,
        <p>{bezierSplit}</p>,
        <ButtonGroup>
          <Button onClick={dec}>
            <Glyphicon glyph="minus"/>
          </Button>
          <Button onClick={inc}>
            <Glyphicon glyph="plus"/>
          </Button>
        </ButtonGroup>
      ]);
    } else {
      return ([
      <Checkbox onChange={() => setBezierSplit(5)}>Subdivide curves</Checkbox>
      ]);
    }
  }

  render () {
    return (
      <Panel header={<h3>controls</h3>}>
        <form>
          <FormGroup>
            {this.makeCheckbox()}
          </FormGroup>
          <FormGroup>
            {this.makeBezierControl()}
          </FormGroup>
        </form>
      </Panel>
    );
  }
}
