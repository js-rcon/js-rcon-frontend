import React from 'react'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import xss from 'xss'
import html from 'react-inner-html'

import { dispatcher } from '../backend/dispatcher'

export default class ResponseViewer extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, data: null }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
  }

  open (responseText) {
    this.setState({ open: true, data: this.parseResponse(responseText) })
  }

  close () {
    this.setState({ open: false })
  }

  parseResponse (response) {
    if (!response) return ''

    // Convert newlines to breaks
    response = response.replaceAll('\n', '<br>')

    // Sanitise input
    response = xss(response, {
      whiteList: {
        br: []
      }
    })

    return response
  }

  componentDidMount () {
    dispatcher.on('OPEN_RESPONSE_VIEWER', responseText => this.open(responseText))
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
        title={'Server response viewer'}
        className={'response-viewer'}
        actions={dialogActions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.close}
      >
        <div
          className={'response'}
          {...html(this.parseResponse(this.state.data))}
        >
          {/*
              This is a bit hazardous, but it needs to be done because line breaks need to be accounted for.
              The input is also sanitised beforehand to mitigate the XSS risk.
          */}
        </div>
      </Dialog>
    )
  }
}
