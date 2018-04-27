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
      loggedIn: sessionStorage.getItem('loggedIn') || false,
      username: sessionStorage.getItem('username') || null
    }
    this.sessionStart = this.sessionStart.bind(this)
    this.sessionEnd = this.sessionEnd.bind(this)
  }

  sessionStart (username) {
    writeToSessionStorage(['loggedIn:true', `username:${username}`])
    this.setState({ loggedIn: true, username: username })
  }

  sessionEnd () {
    removeFromSessionStorage(['loggedIn', 'username'])
    this.setState({ loggedIn: false, username: null })
  }

  componentDidMount () {
    status().then(authed => {
      if (!this.state.loggedIn && this.state.username !== authed.username) {
        this.sessionStart(authed.username)
      }
    })
  }

  render () {
    dispatcher.once('LOGIN_SUCCESS', user => {
      this.sessionStart(user)
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
