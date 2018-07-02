import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

// Tools
import Eval from 'tools/Eval'
import MapChange from 'tools/MapChange'

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
            {this.props.component}
          </Paper>
        </div>
      </div>
    )
  }
}

export default class Tiles extends React.Component {
  render () {
    // Use 5 tiles per row
    return (
      <div>
        <Row>
          <Tile component={<Eval/>}/>
          <Tile component={<MapChange/>}/>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
        </Row>
        <Row>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
          <Tile component={'test'}/>
        </Row>
      </div>
    )
  }
}

Row.propTypes = {
  children: PropTypes.node.isRequired
}

Tile.propTypes = {
  component: PropTypes.node.isRequired
}
