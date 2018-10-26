import React from 'react'
import Tool from '../ToolBase'
import { dispatcher } from '../../backend/dispatcher'

export default class Gag extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // If players are already written to storage, make them available for autocomplete
      autoCompleteData: sessionStorage.getItem('players') ? JSON.parse(sessionStorage.getItem('players')) : []
    }
    this.processAutoCompletes = this.processAutoCompletes.bind(this)
  }

  fields = [
    'Player name'
  ]

  socketPayload = [
    { property: 'op', value: 'GAG' },
    { property: 'user', value: '#player-name' }
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
    const listener = () => {
      if (JSON.stringify(this.state.autoCompleteData) !== sessionStorage.getItem('players')) {
        // Only update if data has been modified
        this.setState({ autoCompleteData: JSON.parse(sessionStorage.getItem('players')) })
      }
    }

    this.listener = listener
    dispatcher.on('RECEIVED_PLAYERS', listener)
  }

  componentWillUnmount () {
    dispatcher.removeListener('RECEIVED_PLAYERS', this.listener)
  }

  render () {
    return (
      <Tool
        title={'Gag player'}
        icon={'volume_off'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'toast'}
        autoCompletes={this.processAutoCompletes()}
      />
    )
  }
}
