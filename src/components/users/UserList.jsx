import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import * as randstr from 'randstr'
import { dispatcher, emitOne } from '../../backend/dispatcher'

export default class UserList extends React.Component {
  constructor (props) {
    super(props)
    this.state = { lastSent: null }
    this.getSocketFn = this.getSocketFn.bind(this)
    this.generateListItems = this.generateListItems.bind(this)
  }

  styles = {
    list: {
      maxHeight: '75vh',
      overflow: 'auto'
    }
  }

  getIconButton () {
    return (
      <IconButton
        iconClassName={'material-icons'}
        tooltip={'Actions'}
        tooltipPosition={'bottom-center'}
      >more_vert</IconButton>
    )
  }

  getIconMenu (playerName, iconButtonElement) {
    const p = playerName // For brevity
    return (
      <IconMenu
        iconButtonElement={iconButtonElement}
      >
        <MenuItem onClick={this.getSocketFn('KICK', p)}>Kick</MenuItem>
        <MenuItem onClick={this.getSocketFn('BAN', p)}>Ban</MenuItem>
        <MenuItem onClick={this.getSocketFn('SLAY', p)}>Slay</MenuItem>
        <MenuItem onClick={this.getSocketFn('GAG', p)}>Gag</MenuItem>
        <MenuItem onClick={this.getSocketFn('UNGAG', p)}>Ungag</MenuItem>
      </IconMenu>
    )
  }

  getSocketFn (socketOp, playerName) {
    const socketData = { op: socketOp, user: playerName }
    const withReason = ['BAN', 'KICK']

    if (withReason.includes(socketOp.toUpperCase())) socketData.reason = 'Kicked by administrator'

    socketData.id = randstr(16)

    const socketFn = () => {
      this.setState({ lastSent: socketData.id })
      window.socket.send(JSON.stringify(socketData))
    }

    return socketFn
  }

  generateListItems () {
    return this.props.playerData.map((player, i) => {
      const icon = this.getIconButton()
      const menu = this.getIconMenu(player.Nick, icon)

      return <ListItem
        key={i}
        primaryText={`${player.Nick} (${player.SteamID})`}
        secondaryText={`${player.IP} (${player.Country})`}
        leftAvatar={<Avatar src={player.avatarmedium}/>}
        rightIconButton={menu}
        disableKeyboardFocus={true}
        onClick={() => window.open(player.profileurl, '_blank')}
      />
    })
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_SERVER_RESPONSE', response => {
      if (this.state.lastSent === response.id || response.id === 'error') {
        emitOne('DISPLAY_RESPONSE_TOAST', response)
      }
    })
  }

  render () {
    return (
      <div>
        <div className={'container-title'}>Connected user list</div>
        <List style={this.styles.list}>
          {this.generateListItems()}
        </List>
      </div>
    )
  }
}

UserList.propTypes = {
  playerData: PropTypes.array.isRequired
}
