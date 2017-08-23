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
      ui: false,
      dragging: null
    };

    this.onMouseMove = this.mouseMoveHandler.bind(this);
    this.onMouseUp = this.mouseUpHandler.bind(this);
  }

  componentDidMount() {
    $(document).keypress((e) => {
      var {ui} = this.state;
      switch (e.which) {
      case 32: // space
        e.preventDefault();
        ui = !ui;
        break;
      default:
      }
      this.setState({ui});
    });
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

  newDocument() {
    this.setState({document: this.props.store.newDocument()});
  }

  findDocument(id) {
    if (!this.state.document || this.state.document.id !== id) {
      this.setState({document: this.props.store.findDocument(id)});
    }
  }

  saveDocument() {
    this.props.store.saveDocument(this.state.document.id, this.state.document);
  }

  setUI(on) {
    this.setState({ui: on});
  }

  movePoint([list, index], [newX, newY]) {
    const {width, height} = this.props;
    
    var {document: {id, pointLists, pointPool}} = this.state;
    var points = pointLists[list];
    var [oldX, oldY] = pointPool[points[index]];

    if (index === 0 || index === points.length - 1) {
      if (oldX === 0) {
        var y = newY / height;
        pointPool[points[0]][0] = 0;
        pointPool[points[0]][1] = y;
        pointPool[points[points.length - 1]][0] = 1;
        pointPool[points[points.length - 1]][1] = y;
      } else if (oldY === 0) {
        var x = newX / width;
        pointPool[points[0]][0] = x;
        pointPool[points[0]][1] = 0;
        pointPool[points[points.length - 1]][0] = x;
        pointPool[points[points.length - 1]][1] = 1;
      }
    } else {
      pointPool[points[index]][0] = newX / width;
      pointPool[points[index]][1] = newY / height;
    }

    this.setState({document: {id, pointLists, pointPool}});
  }

  render () {
    var props = {};

    ["onMouseDown",
     "newDocument",
     "findDocument",
     "movePoint",
     "setUI"
    ].forEach(method => props[method] = this[method].bind(this));
    if (this.state.document) {
      props["saveDocument"] = this.saveDocument.bind(this);
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
          <Route path='/documents/:id' render={routeProps => (<Work {...routeProps} {...props}/>)}/>
          <Route exact path='/documents' render={routeProps => (<List {...props} />)}/>
          <Route path='/storage' render={routeProps => (<Storage {...props}/>)}/>
        </div>
      </Router>
    );
  }
}

App.defaultProps = {
  store: new Store(window.localStorage),
  width: 256,
  height: 256,
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
