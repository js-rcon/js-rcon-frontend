import React from 'react'

import reactLogo from './assets/images/React-icon.png'

export default class App extends React.Component {
  render () {
    return (
      <main className="container">
        <div>
          <h1>Hello world!</h1>
          <img className="container image" alt="React Logo" src={reactLogo} />
          <p>If you see this everything is working!</p>
        </div>
      </main>
    )
  }
}
