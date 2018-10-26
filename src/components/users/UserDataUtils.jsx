import React from 'react'
import PropTypes from 'prop-types'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import * as colors from 'material-ui/styles/colors'
import { emitOne } from '../../backend/dispatcher'

export class PrivateUser extends React.Component {
  constructor (props) {
    super(props)
    this.getButtonData = this.getButtonData.bind(this)
  }

  getButtonData () {
    const isPrivate = this.props.isPrivate
    return {
      color: isPrivate ? colors.orange400 : colors.green600,
      icon: isPrivate ? 'lock' : 'lock_open',
      tooltip: isPrivate ? 'Private profile' : 'Public profile'
    }
  }

  render () {
    const data = this.getButtonData()

    return (
      <IconButton onClick={() => emitOne('OPEN_USER_DATA_HELP')}>
        <FontIcon
          className={'material-icons'}
          color={data.color}
        >
          {data.icon}
        </FontIcon>
      </IconButton>
    )
  }
}

export class YoungUser extends React.Component {
  constructor (props) {
    super(props)
    this.getButtonData = this.getButtonData.bind(this)
  }

  getButtonData () {
    const isYoung = this.props.isYoung
    let color
    let tooltip

    switch (isYoung) {
      case null:
        color = colors.red500
        tooltip = 'Private profile, check failed'
        break
      case true:
        color = colors.orange400
        tooltip = 'New account (Less than 7 days)'
        break
      case false:
        color = colors.green600
        tooltip = 'Mature account (Older than 7 days)'
        break
    }

    return {
      color: color,
      tooltip: tooltip
    }
  }

  render () {
    const data = this.getButtonData()

    return (
      <IconButton onClick={() => emitOne('OPEN_USER_DATA_HELP')}>
        <FontIcon
          className={'material-icons'}
          color={data.color}
        >
          av_timer
        </FontIcon>
      </IconButton>
    )
  }
}

PrivateUser.propTypes = {
  isPrivate: PropTypes.bool.isRequired
}

YoungUser.propTypes = {
  isYoung: PropTypes.bool
}
