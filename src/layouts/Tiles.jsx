import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

// Tools
import Eval from 'tools/Eval'
import MapChange from 'tools/MapChange'
import Slap from 'tools/Slap'
import Slay from 'tools/Slay'
import Kick from 'tools/Kick'
import Gag from 'tools/Gag'
import UnGag from 'tools/UnGag'
import Mute from 'tools/Mute'
import UnMute from 'tools/UnMute'

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
    // Use 4 tiles per row
    return (
      <div>
        <Row>
          <Tile component={<Eval/>}/>
          <Tile component={<MapChange/>}/>
          <Tile component={<Kick/>}/>
          <Tile component={<Slay/>}/>
        </Row>
        <Row>
          <Tile component={<Gag/>}/>
          <Tile component={<UnGag/>}/>
          <Tile component={<Mute/>}/>
          <Tile component={<UnMute/>}/>
        </Row>
        <Row>
          <Tile component={<Slap/>}/>

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
