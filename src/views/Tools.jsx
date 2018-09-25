import React from 'react'
import { Row, Tile } from '../components/Layout'

// Tools
import Eval from 'tools/Eval'
import MapChange from 'tools/MapChange'
import Slap from 'tools/Slap'
import Slay from 'tools/Slay'
import Kick from 'tools/Kick'
import Ban from 'tools/Ban'
import Beacon from 'tools/Beacon'
import Burn from 'tools/Burn'
import Gag from 'tools/Gag'
import UnGag from 'tools/UnGag'
import Mute from 'tools/Mute'
import UnMute from 'tools/UnMute'

export default class Tools extends React.Component {
  render () {
    // Use 4 tiles per row
    return (
      <div>
        <Row>
          <Tile component={<Eval/>}/>
          <Tile component={<MapChange/>}/>
          <Tile component={<Beacon/>}/>
          <Tile component={<Slay/>}/>
        </Row>
        <Row>
          <Tile component={<Gag/>}/>
          <Tile component={<UnGag/>}/>
          <Tile component={<Mute/>}/>
          <Tile component={<UnMute/>}/>
        </Row>
        <Row>
          <Tile component={<Ban/>}/>
          <Tile component={<Kick/>}/>
          <Tile component={<Slap/>}/>
          <Tile component={<Burn/>}/>
        </Row>
      </div>
    )
  }
}
