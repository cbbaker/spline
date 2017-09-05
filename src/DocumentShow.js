import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Tiler from './Tiler';
import {Grid, Alert} from 'react-bootstrap';

import $ from 'jquery';

export default class Show extends Component {
  constructor(props) {
    super(props);
    const {match: {params: {id}}, store} = props;
    let state = this.computeState(id, store);

    ["onMouseDownPoint",
     "onMouseDownOther",
     "onMouseMove",
     "onMouseUp",
     "updateDocumentName",
     "updatePointColor"
    ].forEach(name => {
      this[name] = this[name].bind(this);
      state[name] = this[name];
    });

    this.state = state;
  }

  computeState(id, store) {
    const document = store.findDocument(parseInt(id, 10));
    if (document) {
      return {
        type: "loaded",
        dirty: false,
        document
      };
    } else {
      return {
        type: "not found"
      };
    }
  }

  componentWillReceiveProps(nextProps) {
    const {match: {params: {id}}, store} = nextProps;
    if (id !== this.props.match.params.id) {
      this.setState(this.computeState(id, store));
    }
  }

  componentDidMount() {
    $(document).mousemove(this.onMouseMove);
    $(document).mouseup(this.onMouseUp);
  }

  componentWillUnmount() {
    $(document).unbind('mousemove', this.onMouseMove);
    $(document).unbind('mouseup', this.onMouseUp);
  }

  onMouseDownPoint(tile, selection) {
    console.log("DEBUG: onMouseDownPoint selection: " + JSON.stringify(selection, null, 2));
    this.setState({selection, tile, dragging: true});
  }

  onMouseDownOther() {
    console.log("onMouseDownOther");
    this.setState({selection: undefined});
  }

  onMouseMove(e) {
    var {dragging, selection, tile} = this.state;
    if (dragging && selection !== undefined && selection.type === "point") {
      console.log("onMouseMove");
      let g = ReactDOM.findDOMNode(tile);
      let tmpPt = g.parentElement.createSVGPoint();
      tmpPt.x = e.clientX;
      tmpPt.y = e.clientY;
      var local = tmpPt.matrixTransform(g.getScreenCTM().inverse());
      this.movePoint(selection, [local.x, local.y]);
    }
  }

  onMouseUp(e) {
    console.log("onMouseUp");
    const {document} = this.state;
    this.setState({dragging: false});
    if (this.state.dirty) {
      this.props.store.saveDocument(document.id, document);
      this.setState({dirty: false});
    }
  }

  movePoint({which: [list, index]}, [newX, newY]) {
    const {tileWidth, tileHeight} = this.props;
    
    var {document: {id, name, pointLists, pointPool}} = this.state;
    var points = pointLists[list];
    var [oldX, oldY] = pointPool[points[index]];

    if (index === 0 || index === points.length - 1) {
      if (oldX === 0) {
        var y = newY / tileHeight;
        pointPool[points[0]][0] = 0;
        pointPool[points[0]][1] = y;
        pointPool[points[points.length - 1]][0] = 1;
        pointPool[points[points.length - 1]][1] = y;
      } else if (oldY === 0) {
        var x = newX / tileWidth;
        pointPool[points[0]][0] = x;
        pointPool[points[0]][1] = 0;
        pointPool[points[points.length - 1]][0] = x;
        pointPool[points[points.length - 1]][1] = 1;
      }
    } else {
      pointPool[points[index]][0] = newX / tileWidth;
      pointPool[points[index]][1] = newY / tileHeight;
    }

    this.setState({document: {id, name, pointLists, pointPool}, dirty: true});
  }

  updatePointColor({point: [listIdx, pointIdx]}, color) {
    let {document: {id, name, pointLists, pointPool}} = this.state;
    let points = pointLists[listIdx];

    if (pointIdx === 0 || pointIdx === points.length - 1) {
      pointPool[points[0]][2] = color;
      pointPool[points[points.length - 1]][2] = color;
    } else {
      pointPool[points[pointIdx]][2] = color;
    }

    this.setState({document: {id, name, pointLists, pointPool}});
    this.props.store.saveDocument(this.state.document.id, this.state.document);
  }

  updateDocumentName(name) {
    let {document} = this.state;
    if (document.name !== name) {
      document.name = name;
      this.setState({document});
      this.props.store.saveDocument(document.id, document);
    }
  }

  render() {
    switch (this.state.type) {
    case "loaded":
        return (
    <Tiler {...this.state} {...this.props} />);
    default:
      return (<Grid><Alert bsStyle='danger'>Document not found.</Alert></Grid>);
    }
  }
}
