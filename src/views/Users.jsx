import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { ColRoot, Col } from '../components/Layout'
import UserList from '../components/users/UserList'
import UserTable from '../components/users/UserTable'

// TODO: Remove when done
import * as mockUsers from '../../example-user-data.json'

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

/*
  componentDidMount () {
    dispatcher.on('RECEIVED_PLAYERS', () => {
      if (JSON.stringify(this.state.playerData) !== sessionStorage.getItem('playerData')) {
        // Only update if data has been modified
        this.setState({ playerData: JSON.parse(sessionStorage.getItem('playerData')) })
      }
    })
  }
*/

export default class Users extends React.Component {
  constructor (props) {
    super(props)
    this.state = { playerData: mockUsers.userData }
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
