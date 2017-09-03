import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';

import Generator from './generator';
import NewForm from './NewForm';

export default class New extends Component {
  constructor(props) {
    super(props);
    this.state = this.computeState();

    ["pointCountChanged",
     "horizontalSplineCountChanged",
     "verticalSplineCountChanged",
     "submit"].forEach(name => {
      this[name] = this[name].bind(this);
    });
  }

  computeState() {
    return {
      type: "dialog",
      generator: new Generator({pointCount: 3, horizontalSplineCount: 1, verticalSplineCount:1})
    };
  }

  pointCountChanged(e) {
    const pointCount = parseInt(e.currentTarget.value, 10);
    const {generator} = this.state;
    generator.pointCount = pointCount;
    this.setState({generator});
  }

  horizontalSplineCountChanged(e) {
    const horizontalSplineCount = parseInt(e.currentTarget.value, 10);
    const {generator} = this.state;
    generator.horizontalSplineCount = horizontalSplineCount;
    this.setState({generator});
  }

  verticalSplineCountChanged(e) {
    const verticalSplineCount = parseInt(e.currentTarget.value, 10);
    const {generator} = this.state;
    generator.verticalSplineCount = verticalSplineCount;
    this.setState({generator});
  }

  submit() {
    const doc = this.state.generator.generate(this.props.store);
    this.props.store.saveDocument(doc.id, doc);
    this.setState({
      type: "redirect",
      path: `/documents/${doc.id}`
    });
  }

  render() {
    switch (this.state.type) {
    case "redirect":
      return (
        <Redirect to={this.state.path} />
      );
    default:
      return (
        <NewForm submit={this.submit}
          pointCountChanged={this.pointCountChanged}
          horizontalSplineCountChanged={this.horizontalSplineCountChanged}
          verticalSplineCountChanged={this.verticalSplineCountChanged}
          {...this.state} {...this.props}/>
      );
    }
  }
}


