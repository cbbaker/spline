import React, { Component } from 'react';
import './App.css';
import Tile from './Tile';

class App extends Component {
  render() {
    const width = 128;
    const height = 128;
    const tileProps = {
      width,
      height,
      outlineWidth: 1,
      outlineColor: "rgb(128,128,128)",
      curveWidth: 2,
      curveColor: "rgb(16,16, 16)",
      controlPoints: [
        [  0,  48],
        [ 64,  48],
        [ 64,  48],
        [ 64,  96],
        [ 64,  48],
        [ 64,  48],
        [127,  48]
      ]
    };

    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (<Tile transform={trans} {...tileProps} />);
    };

    var children = [];
    for (var y = 0; y < 3; ++y) {
      for (var x = 0; x < 4; ++x) {
        children.push(tileAt(10 + x * width, 10 + y * height));
      }
    }

    return (
      <svg width="640" height="480">
        {children}
      </svg>
    );
  }
}

export default App;
