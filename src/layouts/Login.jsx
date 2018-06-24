import React from 'react'

import LoginCard from '../components/LoginCard'
import ErrorOverlay from '../components/ErrorOverlay'

// TODO: Get a method to disable viewing of the intermediary state on refresh when a login is still valid
export default class Login extends React.Component {
  styles = {
    imageOverrides: {
      // Disable image on low width devices for better UX
      display: window.innerWidth < 650 ? 'none' : 'initial'
    }
  }

  render () {
    return (
      <div>
        {/* Mount hidden components */}
        <ErrorOverlay/>
        {/* Main interface */}
        <img
          className={'login-logo'}
          style={this.styles.imageOverrides}
          src={require('../assets/images/logo.png')}
        />
        <div className={'login-container'}>
          <LoginCard/>
        </div>
      </div>
    )
  }
}
