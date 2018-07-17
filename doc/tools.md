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
    'ID' // Add more as needed - note: Field names must be unique
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

  autoCompleteData = [
    // Auto complete data for inputs in the tool
    // 'field' is a field ID as above, 'data' is an array of possible values
    { field: 'rcon-command', data: ['sm_listplayers', 'meta list'] },
    { field: 'id', data: [] } // You may submit an empty array, but this is redundant
  ]

  render () {
    return (
      <Tool
        title={'Send RCON Command'} // Tool title
        icon={'cast'} // Material icon - see https://material.io/icons
        fields={this.fields} // Do not modify
        socketPayload={this.socketPayload} // Do not modify
        viewerType={'overlay'} // 'overlay' or 'toast' - if the response is long, use former as it opens a toast - otherwise use toast
        autoComplete={['sm_listplayers', 'sm_ban']} // Optional - possible values to input in the text
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

  autoCompletes = [
    { field: 'rcon-command', data: ['sm_listplayers', 'meta list'] },
    { field: 'id', data: [] }
  ]

  render () {
    return (
      <Tool
        title={'Send RCON Command'}
        icon={'cast'}
        fields={this.fields}
        socketPayload={this.socketPayload}
        viewerType={'overlay'}
        autoCompletes={this.autoCompletes}
      />
    )
  }
}
```

## State and autocomplete

When using state with autocompletes, there are some extra considerations involved.

If you wish to use a state value in an autocomplete, you need to define an autocomplete object as `{ field: 'command', data: '%autoCompleteData' }` and add a **processAutoCompletes** function to the component as follows.

**Commented example**
```js
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
```

**Uncommented example**
```js
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
```

The **%** sign informs the processor that the value is supposed to be replaced with a state value. Note that the state value being accessed needs to be defined in the constructor, or errors will ensue.
