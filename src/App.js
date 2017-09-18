import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import {Jumbotron, Grid, Button} from 'react-bootstrap';

import './App.css';

import Store from './store';
import NavBar from './NavBar';
import Index from './DocumentIndex';
import Show from './DocumentShow';
import New from './DocumentNew';
import Storage from './Storage';

const Home = () => (
  <Grid>
    <Jumbotron>
      <h1>Spline Editor</h1>
      <p>Interactively edit tiling splines.</p>
      <Link to='/documents'>
        <Button bsStyle="primary" bsSize="large">Get started!</Button>
      </Link>
    </Jumbotron>
  </Grid>
);

const App = (props) => (
  <Router basename='/spline'>
    <div>
      <NavBar {...props}/>
      <Switch>
        <Route path='/documents/new' render={routeProps => (<New {...routeProps} {...props}/>)}/>
        <Route path='/documents/:id' render={routeProps => (<Show {...routeProps} {...props}/>)}/>
        <Route path='/documents' render={routeProps => (<Index {...props} />)}/>
        <Route path='/storage' render={routeProps => (<Storage {...props}/>)}/>
        <Route path='/' component={Home}/>
      </Switch>
    </div>
    </Router>
);

App.defaultProps = {
  store: new Store(window.localStorage),
  tileWidth: 192,
  tileHeight: 192,
  outlineWidth: 1,
  outlineColor: "rgb(200,200,200)",
  curveWidth: 2,
  curveColor: "rgb(16,16, 16)",
  pointRadius: 6,
  pointColor: "rgb(100,200,200)"
};

export default App;
