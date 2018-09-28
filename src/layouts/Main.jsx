import React from 'react'
import { Redirect } from 'react-router-dom'
import Routes from './Routes'
import ErrorOverlay from '../components/ErrorOverlay' // Mounted here as it is used across routes
import { status } from '../backend/api'
import { dispatcher, emitOne } from '../backend/dispatcher'
import { encryptToken } from '../backend/encryption'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false,
      username: null
    }

    this.sessionStart = this.sessionStart.bind(this)
    this.sessionEnd = this.sessionEnd.bind(this)
  }

  sessionStart (username, token) {
    if (sessionStorage.removeItem('disconnected')) sessionStorage.removeItem('disconnected') // Cleanup from logout if applicable
    sessionStorage.setItem('token', encryptToken(token))
    this.setState({ loggedIn: true, username: username })
  }

  sessionEnd () {
    sessionStorage.removeItem('token')
    this.setState({ loggedIn: false, username: null })
  }

  componentDidMount () {
    dispatcher.on('LOGIN_SUCCESS', authDetails => {
      this.sessionStart(authDetails.username, authDetails.token)
    })

    dispatcher.on('LOGOUT', () => {
      this.sessionEnd()
    })

    if (sessionStorage.getItem('token')) { // Token exists from previous session
      status().then(authed => {
        const authOK = authed.loggedIn && !authed.error // Auth prereqs
        const stateOK = !this.state.loggedIn && this.state.username !== authed.username // Anti-loop

        if (authOK && stateOK) this.sessionStart(authed.username, authed.token)
        else emitOne('DISPLAY_LOGIN') // Implements invisibility during intermediary state
      })
    } else emitOne('DISPLAY_LOGIN') // Implements invisibility during intermediary state
  }

  render () {
    // Cannot use location.pathname because of the hash, substringing from location.hash instead
    if (this.state.loggedIn && window.location.hash.substring(1) !== '/dashboard') {
      window.onkeypress = null // Unregister LoginCard enter event handler
      return <Redirect to={'/dashboard'}/>
    }

    return (
      <div>
        <ErrorOverlay/>
        <Routes loggedIn={this.state.loggedIn} inheritedState={this.state}/>
      </div>
    )
  }
}
