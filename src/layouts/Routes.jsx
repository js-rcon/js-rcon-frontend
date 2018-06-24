import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route, Redirect } from 'react-router-dom'

import Login from './Login'
import Dashboard from './Dashboard'

// Simple catch-all component for unexpected requests
class RedirectToRoot extends React.Component {
  render () {
    return (
      <Redirect to={'/'}/>
    )
  }
}

export default class Routes extends React.Component {
  render () {
    return (
      <Switch>
        <Route exact path={'/'} component={Login}/>
        <Route
          path={'/dashboard'}
          render={() => {
            if (this.props.loggedIn) return <Dashboard inheritedState={this.props.inheritedState} token={sessionStorage.getItem('token')}/>
            else return <Redirect to={'/'}/> // In case an extra rendering of the route is required but the login is not valid
          }}/>
        {/* Catch-all */}
        <Route component={RedirectToRoot}/>
      </Switch>
    )
  }
}

Routes.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  inheritedState: PropTypes.object.isRequired
}
