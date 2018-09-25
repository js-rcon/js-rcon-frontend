import React from 'react'
import PropTypes from 'prop-types'

export default class UserList extends React.Component {
  render () {
    return (
      'list'
    )
  }
}

UserList.propTypes = {
  playerData: PropTypes.array.isRequired
}
