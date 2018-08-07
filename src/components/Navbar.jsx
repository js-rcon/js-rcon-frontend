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
      darkThemeEnabled: window.settings.darkThemeEnabled || false
    }
  }

  styles = {
    darkThemeTitle: {
      color: '#FFFFFF'
    }
  }

  toggleMenu () {
    emitOne('TOGGLE_SIDEBAR')
  }

  componentDidMount () {
    dispatcher.on('TOGGLE_THEME', enabled => this.setState({ darkThemeEnabled: enabled }))
  }

  render () {
    return (
      <AppBar
        title={'JS-RCON Dashboard'}
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
