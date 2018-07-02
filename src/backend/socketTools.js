import * as randstr from 'randstr'
import { emitOne } from './dispatcher'

function socketBootup () {
  // List maps and players
  sendSocketMessage({ op: 'LISTMAPS' })
}

function storeMaps (mapNameArray) {
  localStorage.setItem('maps', JSON.stringify(mapNameArray))
  emitOne('RECEIVED_MAPS')
}

/**
 * Send a WebSocket message. Shorthand for functions in this file.
 * @param {Object} payload Websocket payload
 */
function sendSocketMessage (payload) {
  // Assign ID for tracking
  payload.id = randstr(16)

  window.socket.send(JSON.stringify(payload))
}

export { socketBootup, storeMaps }
