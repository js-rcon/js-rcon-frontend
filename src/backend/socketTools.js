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
  const oldPlayerNames = JSON.parse(sessionStorage.getItem('players')) || []
  const newPlayerNames = playerObjectArray.map(p => p.Nick)
  const connectionChanges = mapConnectsAndDisconnects(oldPlayerNames, newPlayerNames)

  sessionStorage.setItem('players', JSON.stringify(newPlayerNames))
  sessionStorage.setItem('playerData', JSON.stringify(playerObjectArray)) // Store raw data for other purposes
  emitOne('RECEIVED_PLAYERS', connectionChanges)
}

/**
 * Map connected and disconnected players.
 * @param {Array<String>} oldInfo Array of player name strings in store
 * @param {Array<String>} newInfo Array of newly received player name strings
 */
function mapConnectsAndDisconnects (oldInfo, newInfo) {
  const result = {
    connected: [],
    disconnected: []
  }

  newInfo.forEach(player => {
    // Player exists in new info but not old = connected
    if (!oldInfo.includes(player)) result.connected.push(player)
  })

  oldInfo.forEach(player => {
    // Player exists in old info but not new = disconnected
    if (!newInfo.includes(player)) result.disconnected.push(player)
  })

  return result
}

function setHeartbeatTimeout () {
  const timeoutId = setTimeout(() => emitOne('NO_HEARTBEAT'), 7500)
  sessionStorage.setItem('heartbeat', JSON.stringify(timeoutId))
}

function clearAndSetNewTimeout () {
  const oldTimeoutId = JSON.parse(sessionStorage.getItem('heartbeat'))

  // Anti-tamper
  if (window.isNumber(oldTimeoutId)) {
    clearTimeout(oldTimeoutId)
    setHeartbeatTimeout()
  }
}

function clearHeartbeatTimeout () {
  const timeoutId = JSON.parse(sessionStorage.getItem('heartbeat'))

  // Anti-tamper
  if (window.isNumber(timeoutId)) {
    clearTimeout(timeoutId)
  }
}

function processHeartbeatTimeout () {
  if (sessionStorage.getItem('heartbeat')) clearAndSetNewTimeout()
  else setHeartbeatTimeout()
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

export { socketBootup, storeMaps, storePlayers, setHeartbeatTimeout, clearHeartbeatTimeout, processHeartbeatTimeout }
