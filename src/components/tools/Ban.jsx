import React from 'react'
import Tool from '../ToolBase'
import { dispatcher } from '../../backend/dispatcher'

export default class Ban extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // If players are already written to storage, make them available for autocomplete
      autoCompleteData: sessionStorage.getItem('players') ? JSON.parse(sessionStorage.getItem('players')) : []
    }
    this.processAutoCompletes = this.processAutoCompletes.bind(this)
  }

  fields = [
    'Player name',
    'Reason',
    'Time'
  ]

  socketPayload = [
    { property: 'op', value: 'BAN' },
    { property: 'user', value: '#player-name' },
    { property: 'reason', value: '#reason' },
    { property: 'time', value: '#time' }
  ]

  autoCompletes = [
    { field: 'player-name', data: '%autoCompleteData' }
  ]

  processAutoCompletes () {
    const processed = []

    this.autoCompletes.forEach(obj => {
      const processedObj = { ...obj }

      if (typeof obj.data === 'string' && obj.data.startsWith('%')) {
        if (obj.data !== this.state[obj.data.substring(1)]) {
          processedObj.data = this.state[obj.data.substring(1)]
          processed.push(processedObj)
        }
      }
    })

    return processed
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_PLAYERS', () => {
      if (JSON.stringify(this.state.autoCompleteData) !== sessionStorage.getItem('players')) {
        // Only update if data has been modified
        this.setState({ autoCompleteData: JSON.parse(sessionStorage.getItem('players')) })
      }
    })
  }

  render () {
    return (
      <Tool
        title={'Ban player'}
        icon={'gavel'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'toast'}
        autoCompletes={this.processAutoCompletes()}
      />
    )
  }
}
