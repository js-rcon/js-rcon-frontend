import React from 'react'
import PropTypes from 'prop-types'
import * as io from 'socket.io-client'

import * as config from '../config'
import { status } from '../backend/api'
import { decryptToken } from '../backend/encryption'

export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      socketConnected: false,
      socketFailed: false,
      socketError: null
    }
    this.socket = null
  }

  componentDidMount () {
    // In production, the servers run on the same address
    const prodWssUrl = `http://localhost:${window.location.port}`
    const wssUrl = process.env && process.env.NODE_ENV === 'development' ? config.apiUrl : prodWssUrl

    this.socket = io.connect(wssUrl)

    this.socket.emit('authentication', {
      username: this.props.inheritedState.username,
      token: decryptToken(this.props.token)
    })

    this.socket.on('connect', () => {
      this.socket.on('authenticated', () => {
        this.setState({ socketConnected: true })
      })

      this.socket.on('unauthorized', err => {
        this.setState({ socketFailed: true, socketError: err })
      })
    })
  }

  render () {
    return (
      <div>
        Inherited state: {JSON.stringify(this.props.inheritedState)}<br/>
        Token: {this.props.token}<br/>
        Socket authenticated: {JSON.stringify(this.state.socketConnected)}<br/>
        Socket unauthorised: {JSON.stringify(this.state.socketFailed)}<br/>
        Socket error: {JSON.stringify(this.state.socketError)}
      </div>
    )
  }
}

Dashboard.propTypes = {
  inheritedState: PropTypes.object,
  token: PropTypes.string
}
