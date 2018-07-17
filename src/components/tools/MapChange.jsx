import React from 'react'

import Tool from '../ToolBase'

import { dispatcher } from '../../backend/dispatcher'

export default class MapChange extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // If maps are already written to storage, make them available for autocomplete
      autoCompleteData: sessionStorage.getItem('maps') ? JSON.parse(sessionStorage.getItem('maps')) : []
    }
    this.processAutoCompletes = this.processAutoCompletes.bind(this)
  }

  fields = [
    'Map name'
  ]

  socketPayload = [
    { property: 'op', value: 'MAPCHANGE' },
    { property: 'c', value: '#map-name' }
  ]

  autoCompletes = [
    { field: 'map-name', data: '%autoCompleteData' }
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
    dispatcher.on('RECEIVED_MAPS', () => {
      this.setState({ autoCompleteData: JSON.parse(sessionStorage.getItem('maps')) })
    })
  }

  render () {
    return (
      <Tool
        title={'Change map'}
        icon={'map'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'toast'}
        autoCompletes={this.processAutoCompletes()}
      />
    )
  }
}
