import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import { emitOne, dispatcher } from '../backend/dispatcher'

export default class SidebarMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, selected: window.settings.defaultView || 'tools' }
    this.toggle = this.toggle.bind(this)
    this.select = this.select.bind(this)
  }

  toggle () {
    this.setState({ open: !this.state.open })
  }

  select (requestedView) {
    emitOne('REQUEST_VIEW_CHANGE', requestedView)
    this.setState({ open: false, selected: requestedView })
  }

  componentDidMount () {
    dispatcher.on('TOGGLE_SIDEBAR', () => this.toggle())
  }

  render () {
    const menuItems = [
      <MenuItem
        primaryText={'Tools'}
        rightIcon={<i className={`material-icons ${this.state.selected === 'tools' ? 'sidebar-icon-selected' : ''}`}>settings</i>}
        key={'tools'}
        onClick={() => this.select('tools')}
      />,
      <MenuItem
        primaryText={'Users'}
        rightIcon={<i className={`material-icons ${this.state.selected === 'users' ? 'sidebar-icon-selected' : ''}`}>person</i>}
        key={'users'}
        onClick={() => this.select('users')}
      />,
      <MenuItem
        primaryText={'Console'}
        rightIcon={<i className={`material-icons ${this.state.selected === 'console' ? 'sidebar-icon-selected' : ''}`}>computer</i>}
        key={'console'}
        onClick={() => this.select('console')}
      />
    ]

    return (
      <Drawer
        docked={false}
        width={200}
        open={this.state.open}
        onRequestChange={open => this.setState({ open })}
      >
        {menuItems}
      </Drawer>
    )
  }
}
