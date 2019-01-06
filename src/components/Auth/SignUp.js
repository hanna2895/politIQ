import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import { compose } from 'recompose';

import { auth, db, withFirebase } from '../../firebase';
import { SignInLink } from './SignIn';

import * as routes from '../../constants/routes';
import * as roles from '../../constants/roles';

//UI
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import './Auth.css';

import FacebookAuth from './FacebookAuth'

const SignUpPage = ({ history, getSignedInUser, scoreObject }) =>
  <Paper className="authCard signUp">
    <Helmet>
      <title>Sign Up | politIQ</title>
    </Helmet>
    <h1>Sign Up</h1>
    <SignUpForm history={history} getSignedInUser={getSignedInUser} scoreObject={scoreObject}/>
    <FacebookAuth history={history}/>
    <SignInLink />
  </Paper>

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  affiliation: '',
  isAdmin: true,
  bio: '',
  error: null, 
};

const affiliations = [
  {
    value: 'Democrat',
  },
  {
    value: 'Republican',
  },
  {
    value: 'Independent',
  },
];

const byPropKey = (propertyName, value) => () => ({
  [propertyName]: value,
});

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const {
      username,
      email,
      passwordOne,
      affiliation,
      isAdmin,
      bio,
    } = this.state;

    const rolesArray = [];

    if (isAdmin) {
      rolesArray.push(roles.ADMIN)
    }
    console.log(rolesArray, 'this is roles')
    const {
      history,
      scoreObject
    } = this.props;

    auth.doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {

        // this one creates the user in the firebase database and is where I'll
        // add in the additional information (to the state in this component)
        db.doCreateUser(authUser.user.uid, username, email, affiliation, isAdmin, bio, rolesArray)
          .then(() => {
            const date = moment().format('YYYY-MM-DD')
            db.lastActive(authUser.user.uid, date)
            this.props.getSignedInUser(authUser.user.uid)
            this.setState({ ...INITIAL_STATE });
            history.push(routes.HOME);
          })
          .catch(error => {
            this.setState(byPropKey('error', error));
          });


        if (scoreObject) {
          db.setScore(authUser.user.uid, scoreObject.date, scoreObject.score)
            .catch(error => console.log(error))
        }

      })
      .catch(error => {
        this.setState(byPropKey('error', error));
      });



      event.preventDefault();
  }

  render() {
    const {
      username,
      email,
      affiliation,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      affiliation === '';

    return (
      <form onSubmit={this.onSubmit}>
        <TextField
          margin="normal"
          fullWidth
          value={username}
          onChange={event => this.setState(byPropKey('username', event.target.value ))}
          type="text"
          placeholder = "Display Name"
        />
        <TextField
          margin="normal"
          fullWidth
          value={email}
          onChange={event => this.setState(byPropKey('email', event.target.value ))}
          type="text"
          placeholder = "Email Address"
        />
        <TextField
          margin="normal"
          fullWidth
          value={passwordOne}
          onChange={event => this.setState(byPropKey('passwordOne', event.target.value ))}
          type="password"
          placeholder = "Password"
        />
        <TextField
          margin="normal"
          fullWidth
          value={passwordTwo}
          onChange={event => this.setState(byPropKey('passwordTwo', event.target.value ))}
          type="password"
          placeholder = "Confirm Password"
        />
        <TextField
          select
          label="Political Affiliation"
          value={this.state.affiliation}
          onChange={event => this.setState(byPropKey('affiliation', event.target.value))}
          margin="normal"
          fullWidth
        >
          {affiliations.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.value}
            </MenuItem>
          ))}
        </TextField>
        <FormHelperText>Affiliation will not be shared publicly.</FormHelperText>

        <Button disabled={isInvalid} type="submit" variant="contained" color="primary" style={{ marginTop: '4vh'}}>
          Sign Up
        </Button>

        { error && <p>{error.message}</p> }
      </form>
    );
  }
}

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

const SignUpLink = () =>
  <p>
    Don't have an account?
    {' '}
    <Link to={routes.SIGN_UP}>Sign Up</Link>
  </p>

export default withRouter(SignUpPage);

export {
  SignUpForm,
  SignUpLink,
}
