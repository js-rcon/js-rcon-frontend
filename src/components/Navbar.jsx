import React from 'react'
import PropTypes from 'prop-types'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'

import NavbarMenu from './NavbarMenu'

import { dispatcher, emitOne } from '../backend/dispatcher'

class MenuButton extends React.Component {
  render () {
    return (
      <IconButton
        iconClassName={'material-icons top-bar-icon'}
        onClick={() => this.props.onClick ? this.props.onClick() : undefined}
      >
        {this.props.icon}
      </IconButton>
    )
  }
}

export default class Navbar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      leftMenuOpen: false,
      rightMenuOpen: false,
      darkThemeEnabled: window.settings.darkThemeEnabled || false,
      selectedView: this.parseView(window.settings.defaultView || 'tools')
    }
  }

  styles = {
    darkThemeTitle: {
      color: '#FFFFFF'
    }
  }

  parseView (viewId) {
    switch (viewId) {
      case 'tools': return 'Tools'
      case 'users': return 'Connected Users'
      case 'console': return 'RCON Console'
      default: return 'Tools'
    }
  }

  toggleMenu () {
    emitOne('TOGGLE_SIDEBAR')
  }

  componentDidMount () {
    dispatcher.on('TOGGLE_THEME', enabled => this.setState({ darkThemeEnabled: enabled }))
    dispatcher.on('REQUEST_VIEW_CHANGE', selectedView => this.setState({ selectedView: this.parseView(selectedView) }))
  }

  render () {
    return (
      <AppBar
        title={`JS-RCON Dashboard / ${this.state.selectedView}`}
        className={'top-bar'}
        titleStyle={this.state.darkThemeEnabled ? this.styles.darkThemeTitle : {}}
        iconElementLeft={
          this.state.leftMenuOpen
            ? <MenuButton icon={'close'}/>
            : <MenuButton icon={'menu'}/>
        }
        iconElementLeft={<MenuButton icon={'menu'} onClick={this.toggleMenu}/>}
        iconElementRight={<NavbarMenu username={this.props.username}/>}
        zDepth={2}
      />
    )
  }
}

Navbar.propTypes = {
  username: PropTypes.string.isRequired
}

MenuButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func
}
