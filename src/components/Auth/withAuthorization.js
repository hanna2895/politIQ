import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './AuthUserContext';
import { firebase, withFirebase } from '../../firebase';
import * as routes from '../../constants/routes';

const withAuthorization = (authCondition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          firebase.user(authUser.uid).once('value').then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            if(!authCondition(authUser)) {
              this.props.history.push(routes.SIGN_IN);
            }
          })
        } else {
          this.props.history.push(routes.SIGN_IN);
        }

      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser => authUser ? <Component {...this.props} /> : null }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(
    withRouter,
    withFirebase,
  )(WithAuthorization);
}

export default withAuthorization;
