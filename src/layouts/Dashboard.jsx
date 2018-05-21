import React from 'react'
import { status } from '../backend/api'

export default class Dashboard extends React.Component {
  render () {
    return (
      JSON.stringify(this.props.inheritedState)
    )
  }
}
