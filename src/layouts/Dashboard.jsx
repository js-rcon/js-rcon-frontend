import React from 'react'
import PropTypes from 'prop-types'
import * as io from 'socket.io-client'
import { Redirect } from 'react-router-dom'

import Tiles from '../layouts/Tiles'

import Navbar from '../components/Navbar'
import SettingsOverlay from '../components/SettingsOverlay'
import ErrorOverlay from '../components/ErrorOverlay'
import DebugOverlay from '../components/DebugOverlay'
import ResponseViewer from '../components/ResponseViewer'
import ResponseToast from '../components/ResponseToast'
import Spacer from '../components/Spacer'

import * as config from '../config'
import { decryptToken } from '../backend/encryption'
import { dispatcher, emitOne } from '../backend/dispatcher'

/*
  TODO: Different views:
  Tool view (Current default)
  Connected users view
  Console view (https://www.npmjs.com/package/react-console-component, might need restyling)

  Accessed via left drawer, needs to be made
*/
export default class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // Sockets
      socketConnected: false,
      socketFailed: false,
      socketError: null,
      receivingHeartbeat: false,
      // Component-specific state
      receivedLogoutSignal: false,
      autoProtectEnabled: window.settings.autoProtectEnabled || false
    }

    this.socket = null
    this.connectSocket = this.connectSocket.bind(this)
  }

  devMode = process.env && process.env.NODE_ENV === 'development'

  // In production, the servers run on the same address
  wssUrl = this.devMode ? config.apiUrl : `http://localhost:${window.location.port}`

  componentDidMount () {
    dispatcher.on('LOGOUT_SIGNAL', () => {
      this.setState({ receivedLogoutSignal: true })
    })

    dispatcher.on('TOGGLE_AUTOPROTECT', enabled => {
      this.setState({ autoProtectEnabled: enabled })
    })

    this.socket = io.connect(this.wssUrl)
    window.socket = this.socket

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

    this.socket.on('disconnect', reason => {
      this.setState({ socketConnected: false })
      this.connectSocket()
    })

    this.socket.on('message', msg => {
      const message = JSON.parse(msg)

      if (this.state.autoProtectEnabled) {
        // TODO: Kick private profiles or users that are less than a week old
      }

      // Log messages for debugging
      if (this.devMode && message.op !== 'HEARTBEAT_RESPONSE') console.log('Received WS message: ' + msg)

      // Report that the socket is receiving heartbeats / emit received response ack
      if (message.op === 'HEARTBEAT_RESPONSE') this.setState({ receivingHeartbeat: true })
      else emitOne('RECEIVED_SERVER_RESPONSE', message.c)
    })
  }

  connectSocket () {
    this.socket = io.connect(this.wssUrl)
    window.socket = this.socket
    this.setState({ socketConnected: true })
  }

  componentWillUnmount () {
    this.socket.close()
  }

  render () {
    if (this.state.receivedLogoutSignal) return <Redirect to={'/'}/>

    return (
      <div>
        {/* Mount hidden components */}
        <ErrorOverlay/>
        {
          // Enable debug metric overlay in dev
          process.env && process.env.NODE_ENV === 'development'
            ? <DebugOverlay
              debugData={{
                inheritedState: this.props.inheritedState,
                token: this.props.token,
                socketConnected: this.state.socketConnected,
                socketFailed: this.state.socketFailed,
                socketError: this.state.socketError,
                receivingHeartbeat: this.state.receivingHeartbeat
              }}
            />
            : ''
        }
        <SettingsOverlay/>
        <ResponseViewer/>
        <ResponseToast/>
        {/* Main interface */}
        <Navbar username={this.props.inheritedState.username}/>
        <Spacer top={30}/>
        <Tiles/>
      </div>
    )
  }
}

Dashboard.propTypes = {
  inheritedState: PropTypes.object.isRequired,
  token: PropTypes.string.isRequired
}
