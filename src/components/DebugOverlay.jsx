import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import { dispatcher } from '../backend/dispatcher'

class Icon extends React.Component {
  render () {
    return (
      <i className={'material-icons metric-icon'}>{this.props.children}</i>
    )
  }
}

export default class DebugOverlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open () {
    this.setState({ open: true })
  }

  close () {
    this.setState({ open: false })
  }

  // Converts JSON objects to JS-human-readable format
  jsifyObject (object) {
    let jsonObject = JSON.stringify(object)

    jsonObject = jsonObject.replaceAll('"', '') // Remove double quotes
    jsonObject = jsonObject.replaceAll('{', '{ ').replaceAll('}', ' }') // Space delimiters
    jsonObject = jsonObject.replaceAll(':', ': ').replaceAll(',', ', ') // Space punctuation

    return jsonObject
  }

  componentDidMount () {
    dispatcher.on('OPEN_DEBUG', () => this.open())
  }

  render () {
    const dialogActions = [
      <FlatButton
        label={'Close'}
        primary={true}
        onClick={this.close}
      />
    ]

    return (
      <Dialog
        title={'Debug metrics'}
        actions={dialogActions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.close}
      >
        <div className={`debug ${window.settings.darkThemeEnabled ? 'debug-text-dark' : 'debug-text-light'}`}>
          <p><Icon>cached</Icon> Inherited state: <code>{this.jsifyObject(this.props.debugData.inheritedState)}</code><br/></p>
          <p><Icon>lock</Icon> Token: <code>{this.props.debugData.token}</code></p>
          <p><Icon>power</Icon> Socket connected: <code>{JSON.stringify(this.props.debugData.socketConnected)}</code></p>
          <p><Icon>power_off</Icon> Socket failed: <code>{JSON.stringify(this.props.debugData.socketFailed)}</code></p>
          <p><Icon>error</Icon> Socket error: <code>{JSON.stringify(this.props.debugData.socketError)}</code></p>
        </div>
      </Dialog>
    )
  }
}

DebugOverlay.propTypes = {
  debugData: PropTypes.object.isRequired
}

Icon.propTypes = {
  children: PropTypes.node.isRequired
}
