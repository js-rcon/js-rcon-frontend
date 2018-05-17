import React from 'react'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { PulseLoader } from 'react-spinners'
import * as Colors from 'material-ui/styles/colors'
import Spacer from './Spacer'
import { login } from '../backend/api'
import { dispatcher, emitOne } from '../backend/dispatcher'

const styles = {
  marginFix: {
    marginTop: 0,
    marginBottom: 10
  },
  topMarginFix: {
    marginTop: -14
  },
  alignLeft: {
    textAlign: 'left'
  }
}

export default class LoginCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emptyUser: false,
      emptyPass: false,
      failure: false,
      loggingIn: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.preRequestCheck = this.preRequestCheck.bind(this)
  }

  // This is a bit of an ugly function, but I don't see a lot of better ways to do it
  preRequestCheck (user, pass) {
    if (!user && !pass) {
      this.setState({ emptyUser: true, emptyPass: true })
    } else if (!user) {
      this.setState({ emptyUser: true })
      return false
    } else if (!pass) {
      this.setState({ emptyPass: true })
      return false
    } else {
      return true
    }
  }

  // TODO: Display login failure in the UI
  // TODO: Re-route to dashboard on success (Fade?)
  handleSubmit (username, password) {
    if (this.preRequestCheck(username, password)) {
      this.setState({ // Animation trigger & reset warnings
        loggingIn: true,
        failure: false,
        emptyUser: false,
        emptyPass: false
      })

      login(username, password).then(result => {
        if (result.loggedIn === true) {
          this.setState({ loggingIn: false })
          emitOne('LOGIN_SUCCESS', {
            username: result.username,
            token: result.token
          })
        } else {
          this.setState({ loggingIn: false, failure: true })
        }
      })
    }
  }

  render () {
    return (
      <div>
        <Paper zDepth={1}>
          <div className={'login-inner'}>
            <h1 style={styles.marginFix}>Login to JS-RCON</h1>
            <TextField
              id={'login-username'}
              name={'username'}
              floatingLabelText={'Username'}
              style={styles.topMarginFix}
              errorText={(this.state.failure && 'Invalid username or password') || (this.state.emptyUser && 'Please enter a username')}
              errorStyle={styles.alignLeft}
            />
            <br/>
            <TextField
              id={'login-password'}
              name={'password'}
              style={styles.topMarginFix}
              floatingLabelText={'Password'}
              type={'password'}
              errorText={(this.state.failure && 'Invalid username or password') || (this.state.emptyPass && 'Please enter a password')}
              errorStyle={styles.alignLeft}
            />
            <Spacer top={25}/>
            <RaisedButton
              label={this.state.loggingIn ? '' : 'Login'}
              onClick={() => this.handleSubmit(document.getElementById('login-username').value, document.getElementById('login-password').value)}
              children={
                <PulseLoader
                  key={'loader'}
                  loading={this.state.loggingIn}
                  color={Colors.blue900}
                  size={10}
                />
              }
            />
          </div>
        </Paper>
      </div>
    )
  }
}
