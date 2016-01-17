/*
  Order
*/

import React from 'react';
import CssTransitionGroup from 'react-addons-css-transition-group';
import h from '../helpers'
import autobind from 'autobind-decorator';

@autobind
class Order extends React.Component {

  renderOrder(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={this.props.removeOrder.bind(null, key)}>&times;</button>
    if(!fish) {
      return <li key={key}>Sorry, fish is no longer available. {removeButton}</li>
    }
    return (
      <li key={key}>
        <span>
          <CssTransitionGroup component="span" transitionName="count" transitionLeaveTimeout={250} transitionEnterTimeout={250} >
            <span key={count}>{count}</span>
          </CssTransitionGroup>
          lbs {fish.name} {removeButton}
        </span>
        <span className="price">{h.formatPrice(count * fish.price)}</span>
      </li>
    )
  }

  render() {
    var orderIds = Object.keys(this.props.order);

    var total = orderIds.reduce((prevTotal, key)=> {
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable) {
        return prevTotal + (count * parseInt(fish.price) || 0)
      }
      return prevTotal;
    }, 0);

    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <CssTransitionGroup
            className="order"
            component="ul"
            transitionName="order"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {h.formatPrice(total)}
          </li>
        </CssTransitionGroup>
      </div>
    );
  }
}

Order.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  order: React.PropTypes.object.isRequired,
  removeOrder: React.PropTypes.func.isRequired
}

export default Order;
