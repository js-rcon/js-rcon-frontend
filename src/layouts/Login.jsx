import React from 'react'
import LoginCard from '../components/LoginCard'
import { dispatcher } from '../backend/dispatcher'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = { visible: false }
  }

  componentDidMount () {
    if (sessionStorage.getItem('disconnected')) this.setState({ visible: true })
    dispatcher.on('DISPLAY_LOGIN', () => this.setState({ visible: true }))
  }

  render () {
    return (
      <div className={`login-container ${this.state.visible ? 'visible' : 'invisible'}`}>
        <img
          className={'login-logo'}
          src={require('../assets/images/logo.png')}
        />
        <LoginCard/>
      </div>
    )
  }
}
