import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import FullScreen from 'react-fullscreen';
import Tile from './Tile';

const Preview = (props) => {
  const {width, height} = props;

  if (document.fullscreenElement
      || document.webkitFullscreenElement
      || document.mozFullscreenElement
      || document.msFullscreenElement) {
    const childProps = Object.assign({}, props, {ui: false});

    const {tileWidth, tileHeight} = props;
    const hCount = Math.ceil(width / tileWidth),
          vCount = Math.ceil(height / tileHeight);
    const tileAt = (x, y) => {
      const trans = "translate(" + x + "," + y + ")";
      return (
        <Tile key={trans} transform={trans} {...childProps} ui={false} />
      );
    };

    var children = [];
    for (var y = 0; y < vCount; ++y) {
      for (var x = 0; x < hCount; ++x) {
        children.push(tileAt(x * tileWidth, y * tileHeight));
      }
    }

    return (
      <svg width={width} height={height}>
        {children}
      </svg>
    );
  }
  return (
    <svg width={width} height={height}>
    </svg>
  );
};

class Full extends Component {
  componentDidMount() {
    const screen = ReactDOM.findDOMNode(this.refs.screen);
    if (screen) {
      const requestFullScreen = screen.requestFullscreen
              || screen.webkitRequestFullScreen
              || screen.mozRequestFullScreen
              || screen.msRequestFullscreen;
      if (requestFullScreen) {
        requestFullScreen.call(screen);
      }
    }
  }

  render() {
    return (
      <FullScreen ref="screen">
        <Preview {...this.props}/>
      </FullScreen>
    );
  }
}

export default Full;
