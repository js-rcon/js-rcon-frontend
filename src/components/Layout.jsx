import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'

export class ColRoot extends React.Component {
  render () {
    return (
      <div className={'columns'}>
        {this.props.children}
      </div>
    )
  }
}

export class Col extends React.Component {
  render () {
    return (
      <div className={'column'}>
        {this.props.children}
      </div>
    )
  }
}

export class Row extends React.Component {
  render () {
    return (
      <div className={'tile is-ancestor'}>
        {this.props.children}
      </div>
    )
  }
}

export class Tile extends React.Component {
  render () {
    return (
      <div className={'tile is-parent'}>
        <div className={'tile is-child'}>
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

ColRoot.propTypes = {
  children: PropTypes.node.isRequired
}

Col.propTypes = {
  children: PropTypes.node.isRequired
}

Row.propTypes = {
  children: PropTypes.node.isRequired
}

Tile.propTypes = {
  component: PropTypes.node.isRequired
}
