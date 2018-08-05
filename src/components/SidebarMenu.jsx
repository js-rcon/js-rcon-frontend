import React from 'react'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import { emitOne, dispatcher } from '../backend/dispatcher'

export default class SidebarMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, selected: window.settings.defaultView || '' }
    this.toggle = this.toggle.bind(this)
    this.select = this.select.bind(this)
  }

  toggle () {
    this.setState({ open: !this.state.open })
  }

  select (requestedView) {
    emitOne('REQUEST_VIEW_CHANGE', requestedView)
    this.setState({ open: false, selectedView: requestedView })
  }

  componentDidMount () {
    dispatcher.on('TOGGLE_SIDEBAR', () => this.toggle())
  }

  // TODO: Implement new views, selection and toggling between them

  render () {
    const menuItems = [
      <MenuItem key={'tools'} onClick={() => this.select('tools')}>Tools</MenuItem>,
      <MenuItem key={'users'} onClick={() => this.select('users')}>Users</MenuItem>,
      <MenuItem key={'console'} onClick={() => this.select('console')}>Console</MenuItem>
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
