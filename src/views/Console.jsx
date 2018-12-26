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
    this.terminal = React.createRef()
  }

  componentDidMount () {
    dispatcher.on('RECEIVED_SERVER_RESPONSE', response => {
      const terminal = this.terminal.current

      if (this.state.lastSent === response.id || response.id === 'error') {
        const msg = xss(response.c.replaceAll('\n', '<br>'), {
          whiteList: {
            br: []
          }
        })

        terminal.pushToStdout(msg)
      }
    })
  }

  render () {
    const commands = {
      rcon: {
        description: 'Execute a command on the server.',
        usage: 'rcon [command]',
        fn: (...args) => {
          // The joiner makes sure only whitespace doesn't make it through
          if (!args.length || !args.join(' ').trim()) return 'No command provided!'
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
      }
    }

    return (
      <div className={'console-container'}>
        <Terminal
          ref={this.terminal}
          commands={commands}
          className={'console'}
          contentClassName={'console-content'}
          dangerMode={true}
          welcomeMessage={`Welcome to the RCON console. Type 'help' to get a list of commands.`}
        />
      </div>
    )
  }
}
