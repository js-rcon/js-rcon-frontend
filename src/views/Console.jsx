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
      if (this.state.lastSent === response.id || response.id === 'error') {
        const msg = xss(response.c.replaceAll('\n', '<br>'), {
          whiteList: {
            br: []
          }
        })

        Terminal.manualPushToStdout(msg, true)
      }
    })
  }

  render () {
    const commands = {
      help: {
        fn: (...args) => {
          Terminal.manualPushToStdout(`$ help${args ? ` ${args.join(' ')}` : ''}`)

          Terminal.manualPushToStdout(`
          help - Show a list of available commands.<br>
          rcon - Execute an RCON command on the server. - rcon [command]<br>
          clear - Clear the terminal output.
          `, true)
        }
      },
      rcon: {
        fn: (...args) => {
          Terminal.manualPushToStdout(`$ rcon${args ? ` ${args.join(' ')}` : ''}`)

          // The joiner makes sure only whitespace doesn't make it through
          if (args.length < 1 || !args.join(' ').trim()) Terminal.manualPushToStdout('Please provide a command to execute!')
          else {
            const id = randstr(16)

            const payload = {
              op: 'EVAL',
              c: args.join(' ').trim(), // Remove extraneous whitespace
              id: id
            }

            this.setState({ lastSent: id }, () => {
              window.socket.send(JSON.stringify(payload))
            })
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
      }
    }

    return (
      <div className={'console-container'}>
        <Terminal
          commands={commands}
          className={'console'}
          dangerMode={true}
          noDefaults={true}
          noAutomaticStdout={true}
          welcomeMessage={`Welcome to the RCON console. Type 'help' to get a list of commands.`}
        />
      </div>
    )
  }
}
