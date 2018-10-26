import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { ColRoot, Col } from '../components/Layout'
import UserList from '../components/users/UserList'
import UserTable from '../components/users/UserTable'
import UserDataHelp from '../components/users/UserDataHelp'
import { dispatcher } from '../backend/dispatcher'

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
    this.state = { playerData: [] }
  }

  componentDidMount () {
    const listener = () => {
      if (JSON.stringify(this.state.playerData) !== sessionStorage.getItem('playerData')) {
        // Only update if data has been modified
        this.setState({ playerData: JSON.parse(sessionStorage.getItem('playerData')) })
      }
    }

    this.listener = listener
    dispatcher.on('RECEIVED_PLAYERS', listener)
  }

  componentWillUnmount () {
    // This is done to prevent state updates when unmounted (Component unmounts when view changes)
    dispatcher.removeListener('RECEIVED_PLAYERS', this.listener)
  }

  render () {
    return (
      <div>
        <UserDataHelp/>
        <ColRoot>
          <Col>
            <UserContainer component={<UserList playerData={this.state.playerData}/>}/>
          </Col>
          <Col>
            <UserContainer component={<UserTable playerData={this.state.playerData}/>}/>
          </Col>
        </ColRoot>
      </div>
    )
  }
}

UserContainer.propTypes = {
  component: PropTypes.node.isRequired
}
