import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Main from './layouts/Main'
import { dispatcher } from './backend/dispatcher'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = { darkTheme: false }
  }

  render () {
    dispatcher.once('TOGGLE_THEME', () => {
      this.setState({ darkTheme: !this.state.darkTheme })
    })

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(this.state.darkTheme ? darkBaseTheme : lightBaseTheme)}>
        <BrowserRouter>
          <Main/>
        </BrowserRouter>
      </MuiThemeProvider>
    )
  }
}
