import React from 'react'

import Tool from '../ToolBase'

import { dispatcher } from '../../backend/dispatcher'

export default class Tester extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // If maps are already written to storage, make them available for autocomplete
      autoCompleteData: localStorage.getItem('maps') ? JSON.parse(localStorage.getItem('maps')) : []
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
    this.autoCompletes.map(o => {
      if (typeof o.data === 'string') {
        if (o.data.startsWith('%') && o.data !== this.state[o.data.substring(1)]) o.data = this.state[o.data.substring(1)]
      }
    })

    return this.autoCompletes
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_MAPS', () => this.setState({ autoCompleteData: JSON.parse(localStorage.getItem('maps')) }))
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
