/*
  Inventory
*/

import React from 'react';
import AddFishForm from './AddFishForm'
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
import Constant from '../config';
const base = new Firebase(Constant.fireBaseUrl);


@autobind
class Inventory extends React.Component {

  constructor() {
    super();

    this.state = {
      uid: ''
    }
  }

  componentWillMount() {
    var token = localStorage.getItem('token');
    if (token) {
      base.authWithCustomToken(token, this.authHandler);
    }
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler);
  }

  authHandler(err, authData) {
    if (err) {
      console.log(err);
      return;
    }

    localStorage.setItem('token', authData.token);

    const storeRef = base.child(this.props.params.storeId);
    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};

      if(!data.owner) {
        storeRef.set({
          owner: authData.uid
        });
      }

      this.setState({
        uid: authData.uid,
        owner: data.owner || authData.uid
      });
    });
  }

  logout() {
    base.unauth();
    localStorage.setItem('token', null);
    this.setState({
      uid: null
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="facebook" onClick={this.authenticate.bind(this, 'facebook')}>Log in with facebook</button>
        <button className="github" onClick={this.authenticate.bind(this, 'github')}>Log in with Github</button>
        <button className="twitter" onClick={this.authenticate.bind(this, 'twitter')}>Log in with Twitter</button>
      </nav>
    )
  }

  renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div key={key} className="fish-edit">
        <input type="text" valueLink={linkState('fishes.' + key + '.name')} />
        <input type="text" valueLink={linkState('fishes.' + key + '.price')} />
         <select ref="status" valueLink={linkState('fishes.' + key + '.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" valueLink={linkState('fishes.' + key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.' + key + '.image')} />
        <button onClick={this.props.removeFish.bind(null, key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    let logoutButton = <button onClick={this.logout}>Log out!</button>;

    if(!this.state.uid) {
      return (
        <div>{this.renderLogin()}</div>
      );
    }

    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you are not the owner.</p>
          {logoutButton}
        </div>
      );
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  removeFish: React.PropTypes.func.isRequired,
  linkState: React.PropTypes.func.isRequired,
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired
}

export default Inventory;