import React from 'react'
import PropTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import { PulseLoader } from 'react-spinners'
import * as colors from 'material-ui/styles/colors'
import * as randstr from 'randstr'

import { dispatcher, emitOne } from '../../backend/dispatcher'

class Icon extends React.Component {
  render () {
    return (
      <i className={'material-icons icon'}>{this.props.children}</i>
    )
  }
}

export default class Tool extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      fields: [],
      erroredFields: [], // Implements field-specific errors despite single-component structure
      noInput: false,
      sending: false
    }

    this.generateInputs = this.generateInputs.bind(this)
    this.sendSocketMessage = this.sendSocketMessage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  styles = {
    input: { borderColor: colors.orange500 },
    error: { borderColor: colors.red500 }
  }

  generateInputs (fieldArray) {
    const fieldIdList = [] // Used to track fields for later submission

    const fields = fieldArray.map(field => {
      const fieldId = field.toLowerCase().replaceAll(' ', '-')

      if (!fieldIdList.includes(fieldId)) fieldIdList.push(fieldId)

      return (
        <TextField
          hintText={field}
          id={fieldId}
          key={fieldId}
          multiLine={true}
          rowsMax={2}
          underlineFocusStyle={this.state.noInput && this.state.erroredFields.includes(fieldId) ? this.styles.error : this.styles.input}
          errorText={(this.state.noInput && this.state.erroredFields.includes(fieldId) && 'Please enter a value.')}
          onChange={this.handleChange}
        />
      )
    })

    // This is quite unsafe, but the ID list does not affect rendering in any way. As such setState can be omitted and thus an infinite loop avoided.
    // To anyone reading this: This is a classic case of do as I say, not as I do.
    if (this.state.fields !== fieldIdList) this.state.fields = fieldIdList

    return fields
  }

  sendSocketMessage (fieldValues) {
    const payload = {}

    this.props.socketPayload.map(obj => {
      // # signifies field ID
      if (obj.value.startsWith('#')) payload[obj.property] = fieldValues[obj.value.substring(1)]
      else payload[obj.property] = obj.value
    })

    // Assign unique request ID for tracking
    const requestId = randstr(16)
    payload.id = requestId

    // Send message
    window.socket.send(JSON.stringify(payload))
  }

  handleChange () {
    // Resets errors on field value change
    if (this.state.noInput && this.state.erroredFields.length > 0) {
      this.setState({ noInput: false, erroredFields: [] })
    }
  }

  handleSubmit () {
    // Reset errors and proceed to submit
    this.setState({ noInput: false, erroredFields: [], sending: true }, () => {
      const fields = document.getElementsById(this.state.fields).map(f => {
        return {
          field: f.id,
          value: f.value
        }
      })

      // Check that none of the fields are empty
      const malformed = []
      fields.map(f => { if (!f.value) malformed.push(f.field) })

      if (malformed.length > 0) this.setState({ noInput: true, erroredFields: malformed })

      // Only submit if all fields passed inspection, otherwise wait for user to rectify
      // Data is joined into a string because two arrays cannot be compared
      if (fields.map(f => f.field).join(' ') === this.state.fields.join(' ')) {
        // Format into { fieldId: value } format
        const fieldValues = {}
        fields.map(f => { fieldValues[f.field] = f.value }) // Curlies because of no-return-assign
        this.sendSocketMessage(fieldValues)
        this.setState({ sending: false })
      }
    })
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_SERVER_RESPONSE', response => {
      // Stringify if not already a string
      if (typeof response !== 'string') response = JSON.stringify(response)

      // Determine what viewer to open
      switch (this.props.viewerType) {
        case 'overlay':
          emitOne('OPEN_RESPONSE_VIEWER', response)
          break
        case 'toast':
          emitOne('DISPLAY_RESPONSE_TOAST', response) // TODO: Make toast component
          break
        default:
          console.warn(`Unknown response viewer type: ${this.props.viewerType}`)
      }
    })
  }

  render () {
    return (
      <div className={'tool'}>
        <div className={'title-container'}>
          <Icon>{this.props.icon}</Icon> <span className={'title'}>{this.props.title}</span>
        </div>

        {this.generateInputs(this.props.fields)}

        <div className={'button-container'}>
          <RaisedButton
            label={this.state.sending ? '' : 'Send'}
            onClick={this.handleSubmit}
          >
            <PulseLoader
              key={'loader'}
              loading={this.state.sending}
              color={colors.orange500}
              size={10}
            />
          </RaisedButton>
        </div>
      </div>
    )
  }
}

Tool.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  socketPayload: PropTypes.array.isRequired,
  viewerType: PropTypes.string.isRequired
}
