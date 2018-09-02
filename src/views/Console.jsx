import React from 'react'
import Terminal from 'react-console-emulator'
import randstr from 'randstr'
import xss from 'xss'
import { dispatcher, emitOne } from '../backend/dispatcher'

/*
          +------------------------------------------------------------------------+
          #  SteamID               IP               Country    Nick
          +------------------------------------------------------------------------+
          +------------------------------------------------------------------------+
*/

export default class Console extends React.Component {
  constructor (props) {
    super(props)
    this.state = { lastSent: null }
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_SERVER_RESPONSE', response => {
      if (this.state.lastSent !== response.id || response.id === 'error') {
        emitOne('DISPLAY_IN_CONSOLE', { c: response.c, id: response.id })
      }
    })
  }

  manualPushToStdout (message) {
    const content = document.getElementsByName('react-console-emulator__content')[0]
    const input = document.getElementsByName('react-console-emulator__inputArea')[0]

    const messageElement = document.createElement('p')
    messageElement.innerHTML = xss(message)
    messageElement.style = 'margin: 0px; line-height: 21px;'

    content.appendChild(messageElement)
    content.appendChild(input)
  }

  render () {
    const commands = {
      help: {
        description: 'Show a list of available commands.',
        fn: () => {
          return `
            help - Show a list of available commands.<br>
            rcon - Execute an RCON command on the server. - rcon [command]<br>
            clear - Clear the terminal output.
          `
        }
      },
      rcon: {
        description: 'Execute an RCON command on the server.',
        usage: 'rcon <command>',
        fn: function () {
          const input = Array.from(arguments).join(' ')

          const payload = {
            op: 'EVAL',
            c: input,
            id: randstr(16)
          }
        }
      },
      clear: {
        fn: () => {
          const content = document.getElementsByName('react-console-emulator__content')[0]
          const children = Array.from(content.children)

          children.forEach(child => {
            if (child.tagName.toLowerCase() !== 'div') content.removeChild(child)
          })
        }
      },
      test: {
        fn: () => {
          this.manualPushToStdout('test')
        }
      }
    }

    return (
      <div className={'console-container'}>
        <Terminal
          commands={commands}
          className={'console'}
          dangerMode={true}
          noDefaults={true}
          welcomeMessage={`Welcome to the RCON console. Type 'help' to get a list of commands.`}
        />
      </div>
    )
  }
}
