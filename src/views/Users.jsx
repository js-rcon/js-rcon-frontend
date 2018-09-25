import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { ColRoot, Col } from '../components/Layout'
import UserList from '../components/users/UserList'
import UserTable from '../components/users/UserTable'
import { dispatcher } from '../backend/dispatcher';

// Views: One with a List for options, another with a Table to easily provide overview
// Allow for actions via popover menu (Kick, ban, etc.)

class UserContainer extends React.Component {
  render () {
    return (
      <Paper
        className={'user-container'}
        zDepth={1}
      >
        {this.props.component}
      </Paper>
    )
  }
}

export default class Users extends React.Component {
  constructor (props) {
    super(props)
    this.state = { playerData: data }
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_PLAYERS', () => {
      if (JSON.stringify(this.state.playerData) !== sessionStorage.getItem('playerData')) {
        // Only update if data has been modified
        this.setState({ playerData: JSON.parse(sessionStorage.getItem('playerData')) })
      }
    })
  }

  render () {
    return (
      <ColRoot>
        <Col>
          <UserContainer component={<UserList playerData={this.state.playerData}/>}/>
        </Col>
        <Col>
          <UserContainer component={<UserTable playerData={this.state.playerData}/>}/>
        </Col>
      </ColRoot>
    )
  }
}

UserContainer.propTypes = {
  component: PropTypes.node.isRequired
}

// Data snapshot provided from sessionStorage.playerData (Remember proofing)
const data = [
  {
    '#': '1.',
    SteamID: 'STEAM_0:1:85580719',
    IP: '10.0.75.1',
    Country: 'not found',
    Nick: 'LWTech',
    steamid64: '76561198131427167',
    avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/9f/9f8f3830a6b13d92555458209d7472e57d063323_medium.jpg',
    profileurl: 'https://steamcommunity.com/id/linuswillner/',
    private: false,
    young: false // or null (For private profiles)
  },
  {
    '#': '2.',
    SteamID: 'STEAM_0:1:49704738',
    IP: '78.157.211.238',
    Country: 'United Kingdom',
    Nick: 'DeadHill',
    steamid64: '15266479358777753',
    avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/68/685c7dd7bb77e7349e2659cb5857460b6e0e2107_medium.jpg',
    profileurl: 'https://steamcommunity.com/id/deadhill',
    private: false,
    young: false
  },
  {
    '#': '3.',
    SteamID: 'STEAM_0:1:60493827',
    IP: '75.130.252.100',
    Country: 'Sweden',
    Nick: 'Jakalor',
    steamid64: '45374491974461030',
    avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/ab/abdcf268eeb88490ea8e5648d85cbd3641ef357a_medium.jpg',
    profileurl: 'https://steamcommunity.com/id/jakalor',
    private: false,
    young: true
  },
  {
    '#': '4.',
    SteamID: 'STEAM_0:1:49607845',
    IP: '168.157.90.100',
    Country: 'Russia',
    Nick: 'Hietala',
    steamid64: '45374491974461030',
    avatarmedium: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/d3/d3eeb9d031149c6957196c25919e57b9affcf1a4_medium.jpg',
    profileurl: 'https://steamcommunity.com/id/hhietala',
    private: true,
    young: null
  }
]
