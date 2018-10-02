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

// The amount of tools to show per row depending on screen width
const widthScale = {
  // Single items are automatically applied below 770px width
  two: 770,
  three: 950,
  four: 1275
}

export default class Tools extends React.Component {
  constructor (props) {
    super(props)
    this.state = { toolCount: 0 }
    this.getRows = this.getRows.bind(this)
  }

  getToolCount () {
    const w = window.innerWidth
    let count

    // This is a bit ugly but I can't figure out any better way to do this
    if (w < widthScale.two) count = 1
    else if (w > widthScale.two && w < widthScale.three) count = 2
    else if (w > widthScale.three && w < widthScale.four) count = 3
    else count = 4

    return count
  }

  getRows () {
    const toolCount = this.getToolCount()
    const components = [
      <Eval/>,
      <MapChange/>,
      <Beacon/>,
      <Slay/>,
      <Gag/>,
      <UnGag/>,
      <Mute/>,
      <UnMute/>,
      <Ban/>,
      <Kick/>,
      <Slap/>,
      <Burn/>
    ]

    const tiles = this.distributeComponents(components, toolCount)

    return tiles.map((row, i) => {
      return (
        <Row key={`row-${i}`}>
          {row}
        </Row>
      )
    })
  }

  distributeComponents (componentArray, itemsPerRow) {
    const chunks = []

    for (let i = 0; i < componentArray.length; i += itemsPerRow) {
      chunks.push(componentArray.slice(i, i + itemsPerRow))
    }

    const rowContents = chunks.map((chunk, chunkI) => {
      return chunk.map((component, componentI) => <Tile key={`chunk-${chunkI}-component-${componentI}`} component={component}/>)
    })

    return rowContents
  }

  componentDidMount () {
    this.setState({ toolCount: this.getToolCount() })

    window.addEventListener('resize', () => {
      if (!window.measuring) {
        window.measuring = true
        if (this.state.toolCount !== this.getToolCount()) this.setState({ toolCount: this.getToolCount() })
        setTimeout(() => { window.measuring = false }, 250) // Lowers congestion on resize
      }
    })
  }

  render () {
    return (
      <div>
        {this.getRows()}
      </div>
    )
  }
}
