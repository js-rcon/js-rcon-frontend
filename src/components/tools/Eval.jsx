import React from 'react'
import Tool from '../ToolBase'

export default class Eval extends React.Component {
  fields = [
    'RCON command'
  ]

  socketPayload = [
    { property: 'op', value: 'EVAL' },
    { property: 'c', value: '#rcon-command' }
  ]

  render () {
    return (
      <Tool
        title={'Send RCON Command'}
        icon={'code'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'overlay'}
      />
    )
  }
}
