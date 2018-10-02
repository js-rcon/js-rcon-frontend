import React from 'react'
import { HashRouter } from 'react-router-dom'

import './assets/scss/main.scss' // Import styles
import './backend/nativeExtensions' // Register globals

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Main from './layouts/Main'
import { dispatcher, emitOne } from './backend/dispatcher'
import { loadSettings } from './backend/settingsLoader'

loadSettings()

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { darkTheme: window.settings.darkThemeEnabled || false }
  }

  componentDidMount () {
    if (window.settings.darkThemeEnabled) document.getElementsByTagName('html')[0].style = 'background-color: #424242'

    dispatcher.on('TOGGLE_THEME', enabled => {
      // Set document background color to dark theme when it is enabled
      document.getElementsByTagName('html')[0].style = enabled ? 'background-color: #424242' : ''
      this.setState({ darkTheme: enabled })
    })

    setInterval(() => {
      // If window.settings is nulled or there has been any other tampering, reset
      if (!window.settings || !localStorage.getItem('settings')) {
        loadSettings() // loadSettings decides the appropriate approach
        emitOne('REVERT_SETTINGS')
      }
    }, 5000)
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.darkTheme ? darkBaseTheme : lightBaseTheme)}>
        <HashRouter>
          <Main/>
        </HashRouter>
      </MuiThemeProvider>
    )
  }
}
