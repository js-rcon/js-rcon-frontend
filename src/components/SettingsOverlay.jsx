import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'

import { dispatcher, emitOne } from '../backend/dispatcher'

class Row extends React.Component {
  render () {
    return (
      <div className={'columns'}>
        {this.props.children}
      </div>
    )
  }
}

class Col extends React.Component {
  render () {
    return (
      <div className={'column'}>
        {this.props.children}
      </div>
    )
  }
}

export default class SettingsOverlay extends React.Component {
  constructor () {
    super()
    this.state = {
      open: false,
      settings: JSON.parse(localStorage.getItem('settings')) || {
        darkThemeEnabled: false,
        autoProtectEnabled: false
      },
      oldSettings: null
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.saveSettings = this.saveSettings.bind(this)
    this.revertSettings = this.revertSettings.bind(this)
    this.updateSetting = this.updateSetting.bind(this)
  }

  open () {
    this.setState({ open: true })
  }

  close () {
    this.setState({ open: false })
  }

  updateSetting (key, val) {
    this.setState({
      oldSettings: this.state.settings, // Keep old settings for canceling
      settings: { ...this.state.settings, [key]: val } // Softly merge new settings
    })
  }

  saveSettings () {
    localStorage.setItem('settings', JSON.stringify(this.state.settings))
    window.settings = this.state.settings
    this.setState({ oldSettings: null })
    this.close()
  }

  revertSettings () {
    // Send revert events
    if (this.state.oldSettings) {
      emitOne('TOGGLE_THEME', this.state.oldSettings.darkThemeEnabled)
      emitOne('TOGGLE_AUTOPROTECT', this.state.oldSettings.autoProtectEnabled)
    }

    // Revert to previously stored settings
    localStorage.setItem('settings', JSON.stringify(this.state.oldSettings))

    this.setState({ oldSettings: null, settings: this.state.oldSettings })
    this.close()
  }

  componentDidMount () {
    dispatcher.on('OPEN_SETTINGS', () => this.open())
  }

  render () {
    const dialogActions = [
      <FlatButton
        label={'Cancel'}
        onClick={this.revertSettings}
      />,
      <FlatButton
        label={'Save'}
        onClick={this.saveSettings}
      />
    ]

    return (
      <Dialog
        title={'Settings'}
        actions={dialogActions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.close}
      >
        <Row>
          <Col>
            <Toggle
              label={'Dark theme'}
              labelPosition={'right'}
              toggled={this.state.settings ? this.state.settings.darkThemeEnabled : false}
              onToggle={(event, isEnabled) => {
                emitOne('TOGGLE_THEME', isEnabled)
                this.updateSetting('darkThemeEnabled', isEnabled)
              }}
            />
          </Col>
          <Col>
            <Toggle
              label={'Automatically kick private/new users'}
              labelPosition={'right'}
              toggled={this.state.settings ? this.state.settings.autoProtectEnabled : false}
              onToggle={(event, isEnabled) => {
                emitOne('TOGGLE_AUTOPROTECT', isEnabled)
                this.updateSetting('autoProtectEnabled', isEnabled)
              }}
            />
          </Col>
        </Row>
      </Dialog>
    )
  }
}

Row.propTypes = {
  children: PropTypes.node.isRequired
}

Col.propTypes = {
  children: PropTypes.node.isRequired
}
