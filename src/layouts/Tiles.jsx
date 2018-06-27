import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

// Tools
import Eval from 'tools/Eval'

class Row extends React.Component {
  render () {
    return (
      <div className={'tile is-ancestor'}>
        {this.props.children}
      </div>
    )
  }
}

class Tile extends React.Component {
  render () {
    return (
      <div className={'tile is-parent'}>
        <div className={'tile is-child box'}>
          <Paper
            className={'dashboard-tile'}
            zDepth={1}
          >
            {this.props.children}
          </Paper>
        </div>
      </div>
    )
  }
}

// TODO: Tile colours do not stay dark if DT is enabled and the page is refreshed
export default class Tiles extends React.Component {
  render () {
    // Use 5 tiles per row
    return (
      <div>
        <Row>
          <Tile><Eval/></Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
        </Row>
        <Row>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
          <Tile>Test</Tile>
        </Row>
      </div>
    )
  }
}

Row.propTypes = {
  children: PropTypes.node.isRequired
}

Tile.propTypes = {
  children: PropTypes.node.isRequired
}
