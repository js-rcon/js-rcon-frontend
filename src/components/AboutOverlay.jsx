import React from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import xss from 'xss'
import html from 'react-inner-html'

import { licenses } from '../backend/licenses'
import { emitOne, dispatcher } from '../backend/dispatcher'

class Link extends React.Component {
  render () {
    return (
      <a
        href={this.props.to}
        target={'_blank'}
        tabIndex={'-1'}
      >
        {this.props.children}
      </a>
    )
  }
}

class License extends React.Component {
  parseContent (string) {
    if (!string) return ''

    // Convert newlines to breaks
    string = string.replaceAll('\n', '<br>')

    // Sanitise input
    string = xss(string, {
      whiteList: {
        br: []
      }
    })

    return string
  }

  render () {
    return (
      <Card>
        <CardHeader
          title={this.props.title}
          titleStyle={{ fontWeight: 'normal' }}
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText
          expandable={true}
          {...html(this.parseContent(this.props.content))}
        >
        </CardText>
      </Card>
    )
  }
}

export default class AboutOverlay extends React.Component {
  constructor (props) {
    super(props)
    this.state = { open: false, showLicenses: false }
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.toggleLicenseView = this.toggleLicenseView.bind(this)
  }

  open () {
    this.setState({ open: true })
  }

  close () {
    this.setState({ open: false })
  }

  toggleLicenseView () {
    this.setState({ showLicenses: !this.state.showLicenses })
  }

  generateLicenses () {
    const elementArray = []

    for (let l in licenses) {
      const license = licenses[l]
      elementArray.push(<License
        key={l}
        title={license.title}
        content={license.content}
      />)
    }

    return elementArray
  }

  componentDidMount () {
    dispatcher.on('OPEN_ABOUT', () => this.open())

    dispatcher.on('TOGGLE_LICENSES', () => this.setState({ showLicenses: !this.state.showLicenses }))
  }

  render () {
    const defaultActions = [
      <FlatButton
        label={'Close'}
        onClick={this.close}
      />
    ]

    const licenseViewActions = [
      <FlatButton
        label={'Back'}
        onClick={this.toggleLicenseView}
      />,
      <FlatButton
        label={'Close'}
        onClick={this.close}
      />
    ]

    const br = <span><br/><br/></span>
    const fi = <span className={'flag flag-icon flag-icon-fi'}></span>
    const us = <span className={'flag flag-icon flag-icon-us'}></span>

    const about = (
      <div className={'about'}>
        <div>
          <img
            className={'logo'}
            src={require('../assets/images/logo.png')}
          />
          <div className={'title'}>JS-RCON</div>
          <div className={'subtitle'}>The powerful Source Dedicated Server administration GUI.</div>
          <div className={'content'}>
            This program is fully powered by JavaScript from start to finish.
            Built with <Link to={'https://reactjs.org'}>React</Link>, <Link to={'https://material-ui.com/'}>Material-UI</Link>, <Link to={'https://expressjs.com'}>Express</Link> and <Link to={'https://nodejs.org'}>Node.js</Link> - and no jQuery, of course.
            {br}
            Built in {fi} and {us} by <Link to={'https://github.com/linuswillner'}>Linus</Link> and <Link to={'https://github.com/caf203'}>Curtis</Link>.
            {br}
            JS-RCON is free open source software licensed under the<br/>
            <Link to={'https://www.gnu.org/licenses/agpl-3.0.en.html'}>GNU Affero General Public License version 3</Link>. Source code available on <Link to={'https://github.com/js-rcon'}>GitHub</Link>.
            {br}
            JS-RCON © 2018 Linus Willner and Curtis Fowler. Some rights reserved.<br/>
            This program makes use of open source software. See <a onClick={() => emitOne('TOGGLE_LICENSES')}>applicable licenses</a>.
          </div>
        </div>
      </div>
    )

    const licenses = (
      <div className={'licenses'}>
        <div className={'title'}>Open source notices</div>
        {this.generateLicenses()}
      </div>
    )

    return (
      <Dialog
        actions={this.state.showLicenses ? licenseViewActions : defaultActions}
        overlayClassName={'about-overlay'}
        modal={false}
        autoScrollBodyContent={true}
        open={this.state.open}
        onRequestClose={this.close}
      >
        {this.state.showLicenses ? licenses : about}
      </Dialog>
    )
  }
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

License.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired
}
