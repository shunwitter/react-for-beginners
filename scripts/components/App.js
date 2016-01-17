
/*
  App
*/

import React from 'react';
import Header from './Header';
import Inventory from './Inventory';
import Order from './Order';
import Fish from './Fish';
import Catalyst from 'react-catalyst';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

import ReBase from 're-base';
import Constant from '../config';
var base = ReBase.createClass(Constant.fireBaseUrl);


@autobind
class App extends React.Component {

  constructor() {
    super();

    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentDidMount() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-' + this.props.params.storeId);
    if(localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef)
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  }

  addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  }

  removeOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  }

  addFish(fish) {
    var timestamp = (new Date()).getTime();
    this.state.fishes['fish-' + timestamp] = fish;
    this.setState({ fishes: this.state.fishes });
  }

  removeFish(key) {
    if (confirm("Are you sure?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      });
    }
  }

  loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  }

  renderFish(key) {
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder} />
  }

  render () {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order removeOrder={this.removeOrder} fishes={this.state.fishes} order={this.state.order} />
        <Inventory {...this.props} removeFish={this.removeFish} linkState={this.linkState.bind(this)} fishes={this.state.fishes} addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    );
  }

}

reactMixin.onClass(App, Catalyst.LinkedStateMixin)
export default App;
