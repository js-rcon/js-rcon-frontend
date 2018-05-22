import React from 'react'

import { status } from '../backend/api'

// TODO: Establish WebSocket connection (See sockettest.js in laptop)
// TODO: Test code from most recent commit and go on from there

export default class Dashboard extends React.Component {
  render () {
    return (
      JSON.stringify(this.props.inheritedState)
    )
  }
}
