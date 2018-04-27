import React from 'react'
import { status } from '../backend/api'

export default class Login extends React.Component {
  render () {
    status().then(authed => {
      console.log(authed)
    })

    return (
      'dashboard'
    )
  }
}
