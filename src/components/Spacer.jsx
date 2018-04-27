import React from 'react'
import PropTypes from 'prop-types'

export default class Spacer extends React.Component {
  render () {
    const styles = {
      marginTop: this.props.top,
      marginBottom: this.props.bottom,
      marginLeft: this.props.left,
      marginRight: this.props.right
    }

    return (
      <div style={styles}></div>
    )
  }
}

Spacer.propTypes = {
  marginTop: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  marginBottom: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  marginLeft: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ]),
  marginRight: PropTypes.oneOfType([ PropTypes.string, PropTypes.number ])
}
