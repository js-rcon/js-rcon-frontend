import React from 'react'
import PropTypes from 'prop-types'
import IconMenu from 'material-ui/IconMenu'
import IconButton from 'material-ui/IconButton'
import MenuItem from 'material-ui/MenuItem'

import { emitOne } from '../backend/dispatcher'
import { logout } from '../backend/api'

export default class NavbarMenu extends React.Component {
  render () {
    return (
      <IconMenu
        iconButtonElement={<IconButton iconClassName={'material-icons top-bar-icon'}>more_vert</IconButton>}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {/* Settings */}
        <MenuItem
          primaryText={'Settings'}
          rightIcon={<i className={'material-icons'}>settings</i>}
          onClick={() => emitOne('OPEN_SETTINGS')}
        />
        {/* Debug (If in dev mode) */}
        {
          process.env && process.env.NODE_ENV === 'development'
            ? <MenuItem
              primaryText={'Debug'}
              rightIcon={<i className={'material-icons'}>bug_report</i>}
              onClick={() => {
                emitOne('OPEN_DEBUG')
              }}
            />
            : ''
        }
        {/* Logout */}
        <MenuItem
          primaryText={`Log out ${this.props.username}`}
          rightIcon={<i className={'material-icons'}>power_settings_new</i>}
          onClick={() => {
            logout(this.props.username) // Logout is async and can finish in the background
            emitOne('LOGOUT_SIGNAL') // For dashboard redirect
            emitOne('LOGOUT') // Main logout procedure
          }}
        />
      </IconMenu>
    )
  }
}

NavbarMenu.propTypes = {
  username: PropTypes.string.isRequired
}
