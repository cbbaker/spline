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

    ["onFullScreenChange",
     "onFullScreenError",
     "onMouseDownPoint",
     "onMouseDownOther",
     "onMouseMove",
     "onMouseUp",
     "updateDocumentName",
     "onPreview",
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
        preview: false,
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
    $(document).keyup(this.onKeyUp);
    $(document).bind("webkitfullscreenchange", this.onFullScreenChange);
    $(document).bind("mozfullscreenchange", this.onFullScreenChange);
    $(document).bind("msfullscreenchange", this.onFullScreenChange);
    $(document).bind("fullscreenchange", this.onFullScreenChange);
    $(document).bind("webkitfullscreenerror", this.onFullScreenError);
    $(document).bind("mozfullscreenerror", this.onFullScreenError);
    $(document).bind("msfullscreenerror", this.onFullScreenError);
    $(document).bind("fullscreenerror", this.onFullScreenError);
  }

  componentWillUnmount() {
    $(document).unbind('mousemove', this.onMouseMove);
    $(document).unbind('mouseup', this.onMouseUp);
    $(document).unbind('keyup', this.onKeyUp);
    $(document).unbind('fullscreenchange', this.onFullScreenChange);
    $(document).unbind('webkitfullscreenchange', this.onFullScreenChange);
    $(document).unbind('mozfullscreenchange', this.onFullScreenChange);
    $(document).unbind('msfullscreenchange', this.onFullScreenChange);
    $(document).unbind('fullscreenerror', this.onFullScreenError);
    $(document).unbind('webkitfullscreenerror', this.onFullScreenError);
    $(document).unbind('mozfullscreenerror', this.onFullScreenError);
    $(document).unbind('msfullscreenerror', this.onFullScreenError);
  }

  onFullScreenChange(event) {
    if (!(document.fullscreenElement
          || document.webkitFullscreenElement
          || document.mozFullscreenElement
          || document.msFullscreenElement)) {
      this.setState({preview: false});
    }
  }

  onFullScreenError(event) {
    this.setState({preview: false});
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

  onPreview() {
    this.setState({preview: true});
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
      return (<Tiler {...this.state} {...this.props} />);
    default:
      return (<Grid><Alert bsStyle='danger'>Document not found.</Alert></Grid>);
    }
  }
}
