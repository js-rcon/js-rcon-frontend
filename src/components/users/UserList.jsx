import React from 'react'
import PropTypes from 'prop-types'
import Avatar from 'material-ui/Avatar'
import { List, ListItem } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

export default class UserList extends React.Component {
  constructor (props) {
    super(props)
    this.generateListItems = this.generateListItems.bind(this)
  }

  styles = {
    list: {
      maxHeight: '75vh',
      overflow: 'auto'
    }
  }

  generateListItems () {
    const icon = <IconButton
      iconClassName={'material-icons'}
      tooltip={'Actions'}
      tooltipPosition={'bottom-center'}
    >more_vert</IconButton>

    const menu = <IconMenu
      iconButtonElement={icon}
    >
      <MenuItem>Kick</MenuItem>
      <MenuItem>Ban</MenuItem>
      <MenuItem>Slay</MenuItem>
      <MenuItem>Gag</MenuItem>
    </IconMenu>

    // TODO: Allow open via click
    return this.props.playerData.map((player, i) => {
      return <ListItem
        key={i}
        primaryText={`${player.Nick} (${player.SteamID})`}
        leftAvatar={<Avatar src={player.avatarmedium}/>}
        rightIconButton={menu}
        disableKeyboardFocus={true}
      />
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
