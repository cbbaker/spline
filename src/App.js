import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {Jumbotron, Grid, Button} from 'react-bootstrap';

import $ from 'jquery';

import './App.css';

import Store from './store';
import NavBar from './NavBar';
import Work from './Work';
import Preview from './Preview';
import List from './List';
import Storage from './Storage';

const Home = () => (
  <Grid>
    <Jumbotron>
      <h1>Spline Editor</h1>
      <p>Interactively edit tiling splines.</p>
      <Link to='/documents/new'>
        <Button bsStyle="primary" bsSize="large">Get started!</Button>
      </Link>
    </Jumbotron>
  </Grid>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragging: null
    };

    this.onMouseMove = this.mouseMoveHandler.bind(this);
    this.onMouseUp = this.mouseUpHandler.bind(this);
  }

  onMouseDown(list, index, g) {
    this.setState({dragging: [list, index, g]});
    $(document).mousemove(this.onMouseMove);
    $(document).mouseup(this.onMouseUp);
  }

  mouseMoveHandler(e) {
    var {tmpPt, dragging} = this.state;
    if (tmpPt && dragging !== null) {
      let g = dragging[2];
      tmpPt.x = e.clientX;
      tmpPt.y = e.clientY;
      var local = tmpPt.matrixTransform(g.getScreenCTM().inverse());
      this.movePoint(dragging, [local.x, local.y]);
    }
  }

  mouseUpHandler(e) {
    this.setState({dragging: null});
    $(document).unbind('mousemove', this.onMouseMove);
    $(document).unbind('mouseup', this.onMouseUp);
  }

  setTmpPt(tmpPt) {
    this.setState({tmpPt});
  }

  listDocuments(sortFn) {
    const documents = this.props.store.listDocuments().sort(sortFn);
    this.setState({documents, sortFn, document: null});
  }

  newDocument() {
    this.setState({document: this.props.store.newDocument(), documents: null});
  }

  findDocument(id) {
    if (!this.state.document || this.state.document.id !== id) {
      this.setState({document: this.props.store.findDocument(id), documents: null});
    }
  }

  saveDocument() {
    this.props.store.saveDocument(this.state.document.id, this.state.document);
  }

  removeDocument(id) {
    this.props.store.removeDocument(id);
    this.listDocuments(this.state.sortFn);
  }

  movePoint([list, index], [newX, newY]) {
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
  }

  render () {
    var props = {};

    ["onMouseDown",
     "newDocument",
     "findDocument",
     "listDocuments",
     "movePoint"
    ].forEach(method => props[method] = this[method].bind(this));
    if (this.state.document) {
      props["saveDocument"] = this.saveDocument.bind(this);
      props["updateDocumentName"] = this.updateDocumentName.bind(this);
    }
    if (this.state.documents) {
      props["removeDocument"] = this.removeDocument.bind(this);
    }
    if (!this.state.tmpPt) {
      props["setTmpPt"] = this.setTmpPt.bind(this);
    }
    Object.assign(props, this.state, this.props);

    return (
      <Router basename='/spline'>
        <div>
          <NavBar {...props}/>
          <Route exact path='/' component={Home}/>
          <Route exact path='/documents/:id' render={routeProps => (<Work {...routeProps} {...props}/>)}/>
          <Route path='/documents/:id/preview' render={routeProps => (<Preview {...routeProps} {...props}/>)}/>
          <Route exact path='/documents' render={routeProps => (<List {...props} />)}/>
          <Route path='/storage' render={routeProps => (<Storage {...props}/>)}/>
        </div>
      </Router>
    );
  }
}

App.defaultProps = {
  store: new Store(window.localStorage),
  tileWidth: 256,
  tileHeight: 256,
  outlineWidth: 1,
  outlineColor: "rgb(200,200,200)",
  curveWidth: 2,
  curveColor: "rgb(16,16, 16)",
  colorMin: 16,
  colorMax: 220,
  pointRadius: 5,
  pointColor: "rgb(100,200,200)"
};

export default App;
