# Tool component reference

This document outlines the format requirements for a tool component (See **src/components/tools**).

## File structure

A tool component should be placed in the **src/components/tools** folder and look like this.

**IMPORTANT:** You need to import your tool into **src/layouts/Tiles.jsx** and include it inside a **Tile** in the following manner:
```jsx
import MyTool from 'tools/MyTool'

// (In the render function)

<Tile><MyTool/></Tile>
```

Otherwise it will not render. This is a bit counter-intuitive, but with a browser-based infrastructure recursive imports can not be performed per-folder, so this is what we're stuck with.

**Commented example**
```jsx
import React from 'react'

import Tool from '../ToolBase'

// Replace MyTool with the name of your tool (For example Eval)
export default class MyTool extends React.Component {
  fields = [
    'Command', // Defines hint text
    'ID' // Add more as needed
    // NOTE: If field is not added as a socket payload value, the value will not get sent to the server - see below for more
  ]

  socketPayload = [
    // Websocket op - must match one found in backend, also mandatory field
    // See https://github.com/js-rcon/js-rcon-backend/tree/development/internals/wsmethods
    { property: 'op', value: 'EVAL' },
    // Additional socket message fields -  see the specific WS method you're targeting for what needs to be included
    // Use #fieldid to specify that the parameter shall be an input value
    // (Field ID = field name from the 'fields' variable, but lowercase and spaces replaced with dashes)
    { property: 'c', value: '#rcon-command' }
  ]

  render () {
    return (
      <Tool
        title={'Send RCON Command'} // Tool title
        icon={'cast'} // Material icon - see https://material.io/icons
        fields={this.fields} // Do not modify
        socketPayload={this.socketPayload} // Do not modify
        viewerType={'overlay'} // 'overlay' or 'toast' - if the response is long, use former as it opens a toast - otherwise use toast
      />
    )
  }
}
```

**Uncommented example**
```jsx
import React from 'react'

import Tool from '../ToolBase'

export default class MyTool extends React.Component {
  fields = [
    'Command',
    'ID'
  ]

  socketPayload = [
    { property: 'op', value: 'EVAL' },
    { property: 'c', value: '#rcon-command' }
  ]

  render () {
    return (
      <Tool
        title={'Send RCON Command'}
        icon={'cast'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'overlay'}
      />
    )
  }
}
```
