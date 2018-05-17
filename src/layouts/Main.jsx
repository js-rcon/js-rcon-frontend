import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './Login'
import Dashboard from './Dashboard'

import { status } from '../backend/api'
import { dispatcher } from '../backend/dispatcher'
import { writeToSessionStorage, removeFromSessionStorage } from '../backend/utils'

import '../assets/scss/main.scss'

export default class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loggedIn: false,
      username: null,
      token: null
    }
    this.sessionStart = this.sessionStart.bind(this)
    this.sessionEnd = this.sessionEnd.bind(this)
  }

  sessionStart (username, token) {
    writeToSessionStorage(['loggedIn:true', `username:${username}`, `token:${token}`])
    this.setState({ loggedIn: true, username: username })
  }

  sessionEnd () {
    removeFromSessionStorage(['loggedIn', 'username', 'token'])
    this.setState({ loggedIn: false, username: null, token: null })
  }

  componentDidMount () {
    status().then(authed => {
      if (authed.loggedIn && !authed.error) { // For readability, check prerequisites here
        if (!this.state.loggedIn && this.state.username !== authed.username) { // Anti-loop measures
          this.sessionStart(authed.username, authed.token)
        }
      }
    })
  }

  render () {
    dispatcher.once('LOGIN_SUCCESS', authDetails => {
      this.sessionStart(authDetails.username, authDetails.token)
    })

    dispatcher.once('LOGOUT', () => {
      this.sessionEnd()
    })

    if (this.state.loggedIn && window.location.pathname !== '/dashboard') return <Redirect to={'/dashboard'}/>

    return (
      <Switch>
        {/* Login (Root) */}
        <Route
          exact
          path={'/'}
          component={Login}
        />
        {/* Dashboard */}
        <Route path={'/dashboard'} component={Dashboard}/>
      </Switch>
    )
  }
}
