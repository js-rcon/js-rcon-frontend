import React from 'react'
import PropTypes from 'prop-types'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import { PulseLoader } from 'react-spinners'
import * as colors from 'material-ui/styles/colors'
import * as randstr from 'randstr'

import { dispatcher, emitOne } from '../backend/dispatcher'

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
      sending: false,
      lastSent: null, // Implements tracking to avoid unnecessary code execution
      darkThemeEnabled: window.settings.darkThemeEnabled || false
    }

    this.generateInputs = this.generateInputs.bind(this)
    this.getAutoCompleteData = this.getAutoCompleteData.bind(this)
    this.sendSocketMessage = this.sendSocketMessage.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  styles = {
    input: { borderColor: colors.orange500 },
    error: { borderColor: colors.red500 },
    hintText: { color: '#A0A0A0' }
  }

  generateInputs (fieldArray) {
    const fieldIdList = [] // Used to track fields for later submission

    const fields = fieldArray.map(field => {
      const fieldId = field.toLowerCase().replaceAll(' ', '-')

      if (!fieldIdList.includes(fieldId)) fieldIdList.push(fieldId)

      return (
        <AutoComplete
          hintText={field}
          hintStyle={this.state.darkThemeEnabled ? this.styles.hintText : {}}
          id={fieldId}
          key={fieldId}
          multiLine={true}
          rowsMax={2}
          dataSource={this.props.autoCompletes ? this.getAutoCompleteData(fieldId) : []}
          filter={AutoComplete.fuzzyFilter}
          maxSearchResults={5}
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

  getAutoCompleteData (fieldId) {
    // Get the first item - if there are several, the issue will be PEBKAC anyways
    const dataSource = this.props.autoCompletes.filter(a => a.field === fieldId)[0]

    // Not using implicit return because the 'data' property is accessed and thus an existence check is needed
    if (!dataSource) return []
    else return dataSource.data
  }

  sendSocketMessage (fieldValues, requestId) {
    const payload = {}

    this.props.socketPayload.map(obj => {
      // # signifies field ID
      if (obj.value.startsWith('#')) payload[obj.property] = fieldValues[obj.value.substring(1)]
      else payload[obj.property] = obj.value
    })

    payload.id = requestId

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

      if (malformed.length > 0) this.setState({ noInput: true, erroredFields: malformed, sending: false })
      else {
        // Only submit if all fields passed inspection, otherwise wait for user to rectify
        // Data is joined into a string because two arrays cannot be compared
        if (fields.map(f => f.field).join(' ') === this.state.fields.join(' ')) {
          // Format into { fieldId: value } format
          const fieldValues = {}
          fields.map(f => { fieldValues[f.field] = f.value }) // Curlies because of no-return-assign

          // Assign ID for tracking (randomid:viewertype)
          const requestId = `${randstr(16)}:${this.props.viewerType}`

          this.setState({ lastSent: requestId })
          this.sendSocketMessage(fieldValues, requestId)
        }
      }
    })
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_SERVER_RESPONSE', response => {
      this.setState({ sending: false }, () => {
        if (this.state.lastSent !== response.id) { // Avoids unnecessary code execution
          // Stringify content if not a string already
          if (typeof response.c !== 'string') response.c = JSON.stringify(response.c)

          // Determine what viewer to open
          switch (response.id.split(':')[1]) {
            case 'overlay':
              emitOne('OPEN_RESPONSE_VIEWER', { c: response.c, id: response.id })
              break
            case 'toast':
              emitOne('DISPLAY_RESPONSE_TOAST', { c: response.c, id: response.id })
              break
            default:
              console.warn(`Unknown response viewer type: ${this.props.viewerType}`)
          }
        }
      })
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
  viewerType: PropTypes.string.isRequired,
  autoCompletes: PropTypes.array
}
