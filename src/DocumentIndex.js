import React, {Component} from 'react';
import List from './List';

export default class Index extends Component {
  constructor(props) {
    super(props);

    this.state = this.computeState();
  }

  removeDocument(id) {
    if (window.confirm("Are you sure you want to delete this?")) {
      this.props.store.removeDocument(id);
      this.setState(this.computeState());
    }
  }

  computeState() {
    return {
      documents: this.props.store.listDocuments((l, r) => l.updatedAt < r.updatedAt)
    };
  }

  render() {
    return (
      <List removeDocument={this.removeDocument.bind(this)} 
        documents={this.state.documents} {...this.props}
      />
    );
  }
}
