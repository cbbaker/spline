import React from 'react';
import {
  Panel,
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Button
} from 'react-bootstrap';

export default (props) => {
  return (
    <Grid >
      <Row>
        <Col sm={12} md={8}>
          <Panel>
            <form onSubmit={props.submit}>
              <FormGroup controlId='pointCount'>
                <ControlLabel>Shared points</ControlLabel>
                <FormControl onChange={props.pointCountChanged}
                             type='number' value={props.generator.pointCount} />
              </FormGroup>
              <FormGroup controlId='horizontalSplineCount'>
                <ControlLabel>Horizontal Splines</ControlLabel>
                <FormControl onChange={props.horizontalSplineCountChanged}
                             type='number' value={props.generator.horizontalSplineCount} />
              </FormGroup>
              <FormGroup controlId='verticalSplineCount'>
                <ControlLabel>Vertical Splines</ControlLabel>
                <FormControl onChange={props.verticalSplineCountChanged}
                             type='number' value={props.generator.verticalSplineCount} />
              </FormGroup>
              <Button type="submit" bsStyle='default'>Create</Button>
            </form>
          </Panel>
        </Col>
      </Row>
    </Grid>
  );
}
