import React from 'react';
import {
  Panel,
  Button,
  FormGroup,
  ControlLabel,
  FormControl
} from 'react-bootstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import {LinkContainer} from 'react-router-bootstrap';

const DocumentControls = ({
    updateDocumentName,
    document: {name},
    match: {
      params: {id}
    }
  }) => {
  const onNameChanged = (e) => {
    updateDocumentName(e.target.value);
  };
  return (
    <Panel>
      <form>
        <FormGroup controlId='documentName'>
          <ControlLabel>Name</ControlLabel>
          <FormControl onChange={onNameChanged}
                       type='text' value={name} />
        </FormGroup>
      </form>
        <LinkContainer to={`/documents/${id}/preview`}>
        <Button bsStyle='default'>Preview</Button>
      </LinkContainer>
    </Panel>
  );
};

const PointControls = ({
    updatePointColor,
    selection: {
      which: [listIdx, pointIdx]
    },
    document: {
      pointLists,
      pointPool
    }}) => {
  const point = pointPool[pointLists[listIdx][pointIdx]];
  const onChange = (e) => {
    updatePointColor({point: [listIdx, pointIdx]}, e);
  };
  
  return (
    <Panel>
      Location: {`(${point[0]}, ${point[1]})`}
      <Slider min={0} max={1} step={0.01} value={point[2]} onChange={onChange}/>
    </Panel>
  );
};

export default (props) => {
  console.log("DEBUG: selection: " + JSON.stringify(props.selection, null, 2));
  if (props.selection !== undefined) {
    switch (props.selection.type) {
    case "point":
      return (<PointControls {...props}/>);
    default:
    }
  }

  if (props.document) {
    return (<DocumentControls {...props} />);
  }

  return (<div/>);
};
