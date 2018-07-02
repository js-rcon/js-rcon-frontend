import React from 'react'
import Snackbar from 'material-ui/Snackbar'
import { dispatcher } from '../backend/dispatcher'

export default class ResponseToast extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, data: '' }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open (responseText) {
    if (responseText === 'true' || responseText === 'false') {
      // Show success message instead of non-descript 'true' or 'false'
      responseText = JSON.parse(responseText)

      responseText ? responseText = 'Success!' : responseText = 'Failure!'
    }
    this.setState({ open: true, data: responseText })
  }

  close () {
    this.setState({ open: false })
    // This timeout prevents the snackbar animation from twitching when the data is cleared
    setTimeout(() => this.setState({ data: '' }), 500)
  }

  componentDidMount () {
    dispatcher.on('DISPLAY_RESPONSE_TOAST', response => this.open(response.c))
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
