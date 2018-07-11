import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import { dispatcher } from '../backend/dispatcher'

export default class Notification extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, data: '' }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open (data) {
    this.setState({ open: true, data: data })
  }

  close () {
    this.setState({ open: false })
    // This timeout prevents the snackbar animation from twitching when the data is cleared
    setTimeout(() => this.setState({ data: '' }), 500)
  }

  componentDidMount () {
    dispatcher.on('DISPLAY_NOTIFICATION', data => this.open(data))
  }

  render () {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.data}
        action={'OK'}
        autoHideDuration={10000}
        onActionClick={this.close}
        onRequestClose={this.close}
      />
    )
  }
}
