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
      invalidInput: false,
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
      const fieldId = `${this.props.title.toLowerCase().replaceAll(' ', '-')}:${field.toLowerCase().replaceAll(' ', '-')}`

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
          errorText={
            (this.state.noInput && this.state.erroredFields.includes(fieldId) && 'Please enter a value.') ||
            (this.state.invalidInput && this.state.erroredFields.includes(fieldId) && 'No entity found with that name.')
          }
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
    fieldId = fieldId.split(':')[1] // Truncate unique part away

    // Truncate auto complete data - if there are several fields with the same ID, the issue will be PEBKAC anyways
    const dataSource = this.props.autoCompletes.filter(a => a.field === fieldId)[0]

    // Not using implicit return because the 'data' property is accessed and thus an existence check is needed
    if (!dataSource) return []
    else return dataSource.data
  }

  sendSocketMessage (fieldValues, requestId) {
    const payload = {}

    // Detect socket payload values that require inputs
    this.props.socketPayload.map(obj => {
      // # signifies field ID (See tools.md)
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
          field: f.id.split(':')[1], // Truncate unique part away
          uniqueField: f.id,
          value: f.value
        }
      })

      // Check that none of the fields are empty
      const malformed = []
      fields.map(f => {
        // Formats into unique format
        if (!f.value) malformed.push(f.uniqueField)
      })

      if (malformed.length > 0) this.setState({ noInput: true, erroredFields: malformed, sending: false })
      else {
        // Join data into strings to compare them (Arrays cannot be directly compared)
        const fieldsAreIntact = fields.map(f => f.uniqueField).join(' ') === this.state.fields.join(' ')

        if (fieldsAreIntact) {
          const fieldsInTool = fields.map(f => f.field)
          const fieldsWithAC = this.props.autoCompletes.map(a => a.field)

          const fieldValues = {}
          const ACValues = {}

          fields.map(f => { fieldValues[f.field] = f.value }) // Format into { fieldId: value }
          this.props.autoCompletes.map(a => { ACValues[a.field] = a.data }) // Format into { fieldId: autoCompleteData }

          // Check autocomplete validity if enabled (Avoids sending of invalid data to server)
          if (this.props.autoCompletes) {
            const invalidFields = []

            fieldsInTool.forEach(field => {
              // If the input wasn't found in the autocomplete data, add to invalid field list
              if (fieldsWithAC.includes(field) && !ACValues[field].includes(fieldValues[field])) {
                invalidFields.push(`${this.props.title.toLowerCase().replaceAll(' ', '-')}:${field}`) // Unify formatting, see L49
              }
            })

            if (invalidFields.length > 0) {
              this.setState({ invalidInput: true, erroredFields: invalidFields, sending: false })
              return // Using return to terminate the function, as it would otherwise proceed with the request
            }
          }

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
      if (this.state.sending) {
        this.setState({ sending: false }, () => {
          if (this.state.lastSent === response.id || response.id === 'error') { // Avoids unnecessary code execution while allowing errors
            // Stringify content if not a string already
            if (typeof response.c !== 'string') response.c = JSON.stringify(response.c)

            // Explicitly display errors
            if (response.id === 'error') emitOne('OPEN_RESPONSE_VIEWER', { c: response.c, id: response.id })

            // Determine what viewer to open
            switch (response.id.split(':')[1]) {
              case 'overlay':
                emitOne('OPEN_RESPONSE_VIEWER', { c: response.c, id: response.id })
                break
              case 'toast':
                emitOne('DISPLAY_RESPONSE_TOAST', { c: response.c, id: response.id })
                break
              default:
                console.warn(`Unknown response viewer type "${response.id.split(':')[1]}"; using 'viewer'`)
                emitOne('OPEN_RESPONSE_VIEWER', { c: response.c, id: response.id })
                break
            }
          }
        })
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
  viewerType: PropTypes.string.isRequired,
  autoCompletes: PropTypes.array
}
