import React from 'react'
import LoginCard from '../components/LoginCard'
import ErrorOverlay from '../components/ErrorOverlay'

const styles = {
  imageOverrides: {
    // Disable image on low width devices for better UX
    display: window.innerWidth < 650 ? 'none' : 'initial'
  }
}

export default class Login extends React.Component {
  render () {
    return (
      <div>
        <ErrorOverlay/>
        <img
          className={'login-logo'}
          style={styles.imageOverrides}
          src={require('../assets/images/logo.png')}
        />
        <div className={'login-container'}>
          <LoginCard/>
        </div>
      </div>
    )
  }
}
