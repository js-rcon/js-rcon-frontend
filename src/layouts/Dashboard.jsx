import React from 'react'
import PropTypes from 'prop-types'
import * as io from 'socket.io-client'
import { Redirect } from 'react-router-dom'

import Tiles from '../layouts/Tiles'

import Navbar from '../components/Navbar'
import SettingsOverlay from '../components/SettingsOverlay'
import DebugOverlay from '../components/DebugOverlay'
import ResponseViewer from '../components/ResponseViewer'
import ResponseToast from '../components/ResponseToast'
import Notification from '../components/Notification'
import Spacer from '../components/Spacer'

import * as config from '../config'
import { decryptToken } from '../backend/encryption'
import { dispatcher, emitOne } from '../backend/dispatcher'
import { socketBootup, storeMaps, storePlayers, setHeartbeatTimeout, clearHeartbeatTimeout, processHeartbeatTimeout } from '../backend/socketTools'

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
      socketReconnecting: false,
      socketFailed: false,
      socketError: null,
      // Component-specific state
      receivedLogoutSignal: false,
      autoProtectEnabled: window.settings.autoProtectEnabled || false
    }

    this.socket = null
    this.socketHandlers = this.socketHandlers.bind(this)
  }

  devMode = process.env && process.env.NODE_ENV === 'development'

  // In production, the servers run on the same address
  wssUrl = this.devMode ? config.apiUrl : `http://localhost:${window.location.port}`

  notLoggedMessages = [
    'HEARTBEAT_RESPONSE',
    'LISTMAPS_RESPONSE'
  ]

  componentDidMount () {
    dispatcher.on('LOGOUT_SIGNAL', () => {
      this.setState({ receivedLogoutSignal: true })
    })

    dispatcher.on('TOGGLE_AUTOPROTECT', enabled => {
      this.setState({ autoProtectEnabled: enabled })
    })

    dispatcher.on('RECEIVED_PLAYERS', connectionChanges => {
      const c = connectionChanges

      if (c.connected.length > 0) {
        c.connected.forEach(player => {
          emitOne('DISPLAY_NOTIFICATION', `User ${player} connected.`)
        })
      }

      if (c.disconnected.length > 0) {
        c.disconnected.forEach(player => {
          emitOne('DISPLAY_NOTIFICATION', `User ${player} disconnected.`)
        })
      }
    })

    dispatcher.on('NO_HEARTBEAT', () => {
      emitOne('REQUEST_ERROR_OVERLAY', {
        error: 'The client is no longer receiving a heartbeat signal from the server.',
        msg: 'Client is not receiving heartbeat, please reboot backend service.',
        code: 'Orphan'
      })
    })

    this.socketHandlers()
  }

  socketHandlers () {
    this.socket = io.connect(this.wssUrl)
    window.socket = this.socket

    this.socket.emit('authentication', {
      username: this.props.inheritedState.username,
      token: decryptToken(this.props.token)
    })

    this.socket.on('connect', () => {
      this.socket.on('authenticated', () => {
        this.setState({ socketConnected: true, socketReconnecting: false })
        socketBootup()
        setHeartbeatTimeout()
      })

      this.socket.on('unauthorized', err => {
        this.setState({ socketFailed: true, socketError: err })
      })
    })

    this.socket.on('disconnect', () => {
      if (!sessionStorage.getItem('disconnected')) { // Only run on unclean exit
        emitOne('DISPLAY_NOTIFICATION', 'Disconnected from server. Reconnecting...')

        if (!this.state.socketReconnecting) {
          this.setState({ socketConnected: false, socketReconnecting: true })
          this.socket = null
          window.socket = null
          this.socketHandlers()

          setTimeout(() => {
            emitOne('REQUEST_ERROR_OVERLAY', {
              error: 'Cannot reconnect to server, connection timed out after 5 seconds.',
              msg: 'Client cannot connect to backend service. Please ensure the backend service is running and intact.',
              code: 'Curtain'
            })
          }, 7000)
        }
      }
    })

    this.socket.on('message', msg => {
      const message = JSON.parse(msg)

      // Log messages for debugging
      if (this.devMode && !this.notLoggedMessages.includes(message.op)) console.log('Received WS message: ' + msg)

      // Response handlers
      switch (message.op) {
        case 'HEARTBEAT_RESPONSE':
          storePlayers(message.c)
          processHeartbeatTimeout()

          // Automatically kick new and private users if automatic protection is enabled
          if (this.state.autoProtectEnabled && message.c.length > 0) {
            message.c.map(user => {
              if (user.young || user.private) {
                this.socket.send(JSON.stringify({
                  op: 'AUTOKICK',
                  user: user.Nick,
                  reason: 'Kicked by JS-RCON auto-protection',
                  id: 'autokick'
                }))
              }
            })
          }
          break
        case 'LISTMAPS_RESPONSE':
          storeMaps(message.c)
          break
        case 'AUTOKICK_RESPONSE':
          emitOne('DISPLAY_NOTIFICATION', message.c)
          break
        default:
          emitOne('RECEIVED_SERVER_RESPONSE', {
            op: message.op,
            c: message.c,
            id: message.id
          })
          break
      }
    })
  }

  componentWillUnmount () {
    clearHeartbeatTimeout()
    sessionStorage.setItem('disconnected', 'true')
    sessionStorage.removeItems(['maps', 'players', 'playerData', 'heartbeat'])
    this.socket.close()
  }

  render () {
    const debugOverlay = <DebugOverlay
      debugData={{
        inheritedState: this.props.inheritedState,
        token: this.props.token,
        socketConnected: this.state.socketConnected,
        socketFailed: this.state.socketFailed,
        socketError: this.state.socketError
      }}
    />

    if (this.state.receivedLogoutSignal) return <Redirect to={'/'}/>

    // TODO: In production, replace debug with appropriate licenses
    return (
      <div>
        {/* Mount hidden components */}
        <SettingsOverlay/>
        <ResponseViewer/>
        <ResponseToast/>
        <Notification/>
        { process.env && process.env.NODE_ENV === 'development' ? debugOverlay : '' }
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
