import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Tiler from './Tiler';
import {Grid, Alert} from 'react-bootstrap';

import $ from 'jquery';

export default class Show extends Component {
  constructor(props) {
    super(props);
    const {match: {params: {id}}, store} = props;
    this.state = this.computeState(id, store);

    ["onMouseDown", "onMouseMove", "onMouseUp", "updateDocumentName"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  computeState(id, store) {
    const document = store.findDocument(parseInt(id, 10));
    if (document) {
      return {
        type: "loaded",
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

  onMouseDown(dragging) {
    this.setState({dragging});
    $(document).mousemove(this.onMouseMove);
    $(document).mouseup(this.onMouseUp);
  }

  onMouseMove(e) {
    var {dragging} = this.state;
    if (dragging !== null) {
      let g = ReactDOM.findDOMNode(dragging.g);
      let tmpPt = g.parentElement.createSVGPoint();
      tmpPt.x = e.clientX;
      tmpPt.y = e.clientY;
      var local = tmpPt.matrixTransform(g.getScreenCTM().inverse());
      this.movePoint(dragging, [local.x, local.y]);
    }
  }

  onMouseUp(e) {
    this.setState({dragging: null});
    $(document).unbind('mousemove', this.onMouseMove);
    $(document).unbind('mouseup', this.onMouseUp);
    this.props.store.saveDocument(this.state.document.id, this.state.document);
  }

  movePoint({point: [list, index]}, [newX, newY]) {
    const {tileWidth, tileHeight} = this.props;
    
    var {document: {id, pointLists, pointPool}} = this.state;
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

    this.setState({document: {id, pointLists, pointPool}});
  }

  updateDocumentName(name) {
    let {document} = this.state;
    document.name = name;
    this.setState({document});
    this.props.store.saveDocument(document.id, document);
  }

  render() {
    switch (this.state.type) {
    case "loaded":
        return (
          <Tiler updateDocumentName={this.updateDocumentName}
            onMouseDown={this.onMouseDown}
            {...this.state}
            {...this.props}
          />
        );
    default:
      return (<Grid><Alert bsStyle='danger'>Document not found.</Alert></Grid>);
    }
  }
}
