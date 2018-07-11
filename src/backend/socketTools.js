import * as randstr from 'randstr'
import { emitOne } from './dispatcher'

// Extendable socket bootup handler
function socketBootup () {
  _sendSocketMessage({ op: 'LISTMAPS' })
}

function storeMaps (mapNameArray) {
  sessionStorage.setItem('maps', JSON.stringify(mapNameArray))
  emitOne('RECEIVED_MAPS')
}

function storePlayers (playerObjectArray) {
  const playerNames = playerObjectArray.map(p => p.Nick)
  sessionStorage.setItem('players', JSON.stringify(playerNames))
  emitOne('RECEIVED_PLAYERS')
}

/**
 * Send a WebSocket message. Shorthand for functions in this file.
 * @param {Object} payload Websocket payload
 */
function _sendSocketMessage (payload) {
  // Assign ID for tracking
  payload.id = randstr(16)

  window.socket.send(JSON.stringify(payload))
}

export { socketBootup, storeMaps, storePlayers }
