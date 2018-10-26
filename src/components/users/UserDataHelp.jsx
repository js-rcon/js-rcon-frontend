import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import * as colors from 'material-ui/styles/colors'
import { dispatcher } from '../../backend/dispatcher'

export default class UserDataHelp extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, listener: null }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open () {
    this.setState({ open: true })
  }

  close () {
    this.setState({ open: false })
  }

  getDescription (icon, color, description) {
    return (
      <div className={'help-text-container'}>
        <FontIcon
          className={'material-icons'}
          color={color}
        >
          {icon}
        </FontIcon>
        <span className={'help-text'}>{description}</span>
      </div>
    )
  }

  componentDidMount () {
    dispatcher.on('OPEN_USER_DATA_HELP', () => this.open())
  }

  componentWillUnmount () {
    dispatcher.removeEvent('OPEN_USER_DATA_HELP')
  }

  render () {
    const dialogActions = [
      <FlatButton
        label={'Close'}
        primary={true}
        onClick={this.close}
      />
    ]

    return (
      <Dialog
        title={'User data icon legend'}
        titleClassName={'help-title'}
        overlayClassName={'help-overlay'}
        contentClassName={'help-container'}
        actions={dialogActions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.close}
      >
        {this.getDescription('lock_open', colors.green600, 'Public profile')}
        {this.getDescription('lock', colors.orange400, 'Private profile')}
        {this.getDescription('av_timer', colors.green600, 'Account older than 7 days')}
        {this.getDescription('av_timer', colors.orange400, 'Account younger than 7 days')}
        {this.getDescription('av_timer', colors.red500, 'Private profile, account age unknown')}
      </Dialog>
    )
  }
}
