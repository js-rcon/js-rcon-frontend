import React from 'react'
import { HashRouter } from 'react-router-dom'

import './assets/scss/main.scss' // Import styles
import './backend/nativeExtensions' // Register globals

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Main from './layouts/Main'
import { dispatcher } from './backend/dispatcher'

// Load settings from localStorage before application init
// Using JSON.parse because localStorage.getItem returns a string
if (!JSON.parse(localStorage.getItem('settings'))) localStorage.setItem('settings', JSON.stringify({}))
window.settings = JSON.parse(localStorage.getItem('settings'))

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
  }

  render () {
    // Update settings on each render
    window.settings = localStorage.getItem('settings') ? JSON.parse(localStorage.getItem('settings')) : {}

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.darkTheme ? darkBaseTheme : lightBaseTheme)}>
        <HashRouter>
          <Main/>
        </HashRouter>
      </MuiThemeProvider>
    )
  }
}
