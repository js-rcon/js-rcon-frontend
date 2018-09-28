import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Toggle from 'material-ui/Toggle'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
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
class Label extends React.Component {
  constructor (props) {
    super(props)
    this.state = { darkThemeEnabled: window.settings.darkThemeEnabled || false }
  }

  componentDidMount () {
    dispatcher.on('TOGGLE_THEME', enabled => this.setState({ darkThemeEnabled: enabled }))
  }

  render () {
    return (
      <div className={`setting-label ${this.props.child ? 'label-child' : ''}`}>
        <span className={`material-icons ${this.state.darkThemeEnabled ? 'icon-light' : 'icon'}`}>{this.props.icon}</span>
        <span className={`text ${this.state.darkThemeEnabled ? 'text-light' : ''}`}>{this.props.text}</span>
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
        autoProtectEnabled: false,
        defaultView: 'tools'
      },
      oldSettings: {}
    }

    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.saveSettings = this.saveSettings.bind(this)
    this.revertSettings = this.revertSettings.bind(this)
    this.updateSetting = this.updateSetting.bind(this)
  }

  styles = {
    optionLabel: {
      fontWeight: 300,
      position: 'relative',
      transform: 'translate(0px, -2px)'
    }
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
            <Label icon={'computer'} text={'Default view'}/>
            <RadioButtonGroup
              name={'default-view'}
              valueSelected={this.state.settings.defaultView}
              onChange={(event, value) => this.updateSetting('defaultView', value)}
            >
              <RadioButton label={'Tools'} value={'tools'} labelStyle={this.styles.optionLabel}/>
              <RadioButton label={'Users'} value={'users'} labelStyle={this.styles.optionLabel}/>
              <RadioButton label={'Console'} value={'console'} labelStyle={this.styles.optionLabel}/>
            </RadioButtonGroup>
          </Col>
          <Col>
            <Label icon={'color_lens'} text={'Theme'}/>
            <Toggle
              label={'Dark theme'}
              labelPosition={'right'}
              labelStyle={this.styles.optionLabel}
              toggled={this.state.settings ? this.state.settings.darkThemeEnabled : false}
              onToggle={(event, isEnabled) => {
                emitOne('TOGGLE_THEME', isEnabled)
                this.updateSetting('darkThemeEnabled', isEnabled)
              }}
            />
            <Label child icon={'lock'} text={'Auto-Protect'}/>
            <Toggle
              label={'Automatically kick private/new users'}
              labelPosition={'right'}
              labelStyle={this.styles.optionLabel}
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

Label.propTypes = {
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  child: PropTypes.any
}
