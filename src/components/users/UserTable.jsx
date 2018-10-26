import React from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import { PrivateUser, YoungUser } from './UserDataUtils'

export default class UserTable extends React.Component {
  constructor (props) {
    super(props)
    this.populateTable = this.populateTable.bind(this)
  }

  styles = {
    table: {
      maxHeight: '74vh',
      overflow: 'auto'
    },
    tableColumn: {
      padding: '0'
    }
  }

  header = (
    <TableHeader
      displaySelectAll={false}
      enableSelectAll={false}
      adjustForCheckbox={false}
    >
      <TableRow>
        <TableHeaderColumn>User</TableHeaderColumn>
        <TableHeaderColumn>IP</TableHeaderColumn>
        <TableHeaderColumn>Data</TableHeaderColumn>
      </TableRow>
    </TableHeader>
  )

  populateTable () {
    return this.props.playerData.map((player, i) => {
      return <TableRow key={i}>
        <TableRowColumn>{player.Nick}</TableRowColumn>
        <TableRowColumn>{player.IP}</TableRowColumn>
        <TableRowColumn style={this.styles.tableColumn}>
          <PrivateUser isPrivate={player.private}/>
          <YoungUser isYoung={player.young}/>
        </TableRowColumn>
      </TableRow>
    })
  }

  render () {
    return (
      <Table
        bodyStyle={this.styles.table}
        fixedHeader={true}
        selectable={false}
      >
        {this.header}
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
        >
          {this.populateTable()}
        </TableBody>
      </Table>
    )
  }
}

UserTable.propTypes = {
  playerData: PropTypes.array.isRequired
}
