import EventEmitter from 'wolfy87-eventemitter'

const dispatcher = new EventEmitter()

function emit (event, args) {
  dispatcher.emit(event, args)
}

function emitOne (event, arg) {
  dispatcher.emit(event, arg)
}

export { emit, emitOne, dispatcher }
