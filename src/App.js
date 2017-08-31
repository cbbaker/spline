import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import {Jumbotron, Grid, Button} from 'react-bootstrap';

import './App.css';

import Store from './store';
import NavBar from './NavBar';
import Index from './DocumentIndex';
import Show from './DocumentShow';
import Preview from './Preview';
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

const App = (props) => (
  <Router basename='/spline'>
    <div>
      <NavBar {...props}/>
      <Route exact path='/' component={Home}/>
      <Route exact path='/documents/:id' render={routeProps => (<Show {...routeProps} {...props}/>)}/>
      <Route path='/documents/:id/preview' render={routeProps => (<Preview {...routeProps} {...props}/>)}/>
      <Route exact path='/documents' render={routeProps => (<Index {...props} />)}/>
      <Route path='/storage' render={routeProps => (<Storage {...props}/>)}/>
    </div>
    </Router>
);

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
