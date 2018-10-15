import * as config from '../config'

const alertStyle = [
  'font-size: 15px',
  'color: #F79E0C'
].join(';')

const successStyle = [
  'font-size: 15px',
  'color: #3EE514'
].join(';')

function loadSettings () {
  const setDefault = () => {
    localStorage.setItem('settings', JSON.stringify(config.defaultSettings))
    window.settings = config.defaultSettings
  }

  // Not parsing yet to avoid parsing issues with malforming and to check JSON later
  const settings = localStorage.getItem('settings')

  if (!settings) setDefault()
  else {
    let parsedSettings

    try {
      parsedSettings = JSON.parse(localStorage.getItem('settings'))
    } catch (err) {
      console.debug('%c🚨 Malformed JSON in settings, resetting.', alertStyle)
      setDefault()
      return
    }

    if (Array.isArray(parsedSettings)) { // Using isArray because typeof [] === 'object'
      console.debug('%c🚨 Settings was array and not object, resetting.', alertStyle)
      setDefault()
    } else if (!validityCheck(parsedSettings)) {
      console.debug('%c🚨 One or more settings was of wrong type, resetting.', alertStyle)
      setDefault()
    } else {
      console.debug('%c🔧 Settings loaded successfully.', successStyle)
      window.settings = parsedSettings
    }
  }
}

function validityCheck (settingsObject) {
  if (!config.settingsTypes || typeof config.settingsTypes !== 'object') console.error('Malformed settings type declarations in config, cannot perform type check')
  else {
    const malformed = []
    const settingsTypes = config.settingsTypes

    for (let s in settingsObject) {
      if (!settingsTypes[s]) console.warn(`No type declaration for setting '${s}' provided in config (In validityCheck)`)
      else if (!typeCheck(settingsObject[s], settingsTypes[s])) malformed.push(s)
    }

    if (malformed.length > 0) return false
    else return true
  }
}

function typeCheck (valueToCheck, typeFromConfig) {
  const specialComparisons = ['array', 'number']

  if (typeof typeFromConfig !== 'string') console.error(`Invalid type declaration '${typeFromConfig}' (Type ${typeof typeFromConfig}) in typeCheck`)
  else if (specialComparisons.includes(typeFromConfig)) {
    switch (typeFromConfig.toLowerCase()) {
      case 'array': return Array.isArray(valueToCheck)
      case 'number': return window.isNumber(valueToCheck)
      default: console.error(`Unknown special type declaration '${typeFromConfig.toLowerCase()}'`)
    }
  } else {
    return typeof valueToCheck === typeFromConfig.toLowerCase() // eslint-disable-line valid-typeof
  }
}

export { loadSettings }
