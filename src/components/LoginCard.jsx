import React from 'react'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { PulseLoader } from 'react-spinners'
import * as colors from 'material-ui/styles/colors'

import Spacer from './Spacer'
import { login } from '../backend/api'
import { emitOne } from '../backend/dispatcher'

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

  styles = {
    marginFix: {
      marginTop: 0,
      marginBottom: 10
    },
    topMarginFix: {
      marginTop: -14
    },
    alignLeft: {
      textAlign: 'left'
    },
    textField: {
      label: { color: colors.orange500 },
      line: { borderColor: colors.orange500 }
    }
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

  handleSubmit (username, password) {
    if (this.preRequestCheck(username, password)) {
      this.setState({ // Trigger animation and reset warnings
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
    } else this.setState({ loggingIn: false }) // Stop animation
  }

  render () {
    // Detect enter button press
    window.onkeypress = keyEvent => {
      // this.state.loggingIn prevents spamming
      if (!this.state.loggingIn && keyEvent.charCode === 13) { // 13 = Enter
        this.setState({ loggingIn: true })
        this.handleSubmit(document.getElementById('login-username').value, document.getElementById('login-password').value)
      }
    }

    return (
      <div>
        <Paper zDepth={1}>
          <div className={'login-inner'}>
            <h1 style={this.styles.marginFix}>Login to JS-RCON</h1>
            <TextField
              id={'login-username'}
              name={'username'}
              floatingLabelText={'Username'}
              style={this.styles.topMarginFix}
              floatingLabelFocusStyle={this.styles.textField.label}
              underlineFocusStyle={this.styles.textField.line}
              errorText={(this.state.failure && 'Invalid username or password') || (this.state.emptyUser && 'Please enter a username')}
              errorStyle={this.styles.alignLeft}
            />
            <br/>
            <TextField
              id={'login-password'}
              name={'password'}
              floatingLabelText={'Password'}
              style={this.styles.topMarginFix}
              floatingLabelFocusStyle={this.styles.textField.label}
              underlineFocusStyle={this.styles.textField.line}
              type={'password'}
              errorText={(this.state.failure && 'Invalid username or password') || (this.state.emptyPass && 'Please enter a password')}
              errorStyle={this.styles.alignLeft}
            />
            <Spacer top={25}/>
            <RaisedButton
              label={this.state.loggingIn ? '' : 'Login'}
              onClick={() => this.handleSubmit(document.getElementById('login-username').value, document.getElementById('login-password').value)}
              children={
                <PulseLoader
                  key={'loader'}
                  loading={this.state.loggingIn}
                  color={colors.orange500}
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
