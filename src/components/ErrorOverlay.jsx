import React from 'react'
import Dialog from 'material-ui/Dialog'
import { dispatcher } from '../backend/dispatcher'

const headerOptions = [
  'Whoops...',
  'Something broke...',
  'That\'s not gone well...',
  'Oh dear...',
  'That didn\'t sound good...',
  'Something\'s gone horribly wrong...'
]

// TODO: Eventually consider Sentry for automated error reporting
//       This system may be complemented or completely replaced with Sentry at some point (Automate report process)

export default class ErrorOverlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      error: '',
      errorCode: '',
      errorMessage: ''
    }
    this.open = this.open.bind(this)
  }

  open () {
    this.setState({ open: true })
  }

  render () {
    dispatcher.once('REQUEST_ERROR_OVERLAY', args => {
      this.setState({ error: args.error.toString(), errorMessage: args.msg.toString(), errorCode: args.code.toString() })
      this.open()
    })

    return (
      <Dialog
        modal={true}
        open={this.state.open}
        contentClassName={'error-overlay'}
      >
        <h1>{headerOptions[Math.floor(Math.random() * headerOptions.length)]}</h1>
        <p className={'text'}>There was a catastrophic error in the application that cannot be self-repaired. More information below.</p>
        <p className={'error'}>{this.state.error}</p>
        <p className={'text'}>Please contact the site owner and send them the following information:</p>
        <p>
          Error code: <b>{this.state.errorCode}</b>
          <br/>
          Message: {this.state.errorMessage}
        </p>
        {/* Add issue tracker link here */}
      </Dialog>
    )
  }
}
