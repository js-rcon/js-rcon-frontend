import * as config from '../config'

function loadSettings () {
  const setDefault = () => {
    localStorage.setItem('settings', JSON.stringify({}))
    window.settings = {}
  }

  // Pre-flight check that settings are initiated and not malformed
  // Not parsing yet to avoid parsing issues with malforming and to check JSON later
  const settings = localStorage.getItem('settings')

  if (!settings) setDefault()
  else {
    let parsedSettings

    try {
      parsedSettings = JSON.parse(localStorage.getItem('settings'))
    } catch (err) {
      console.debug('Malformed JSON in settings, resetting.')
      setDefault()
      return
    }

    if (Array.isArray(parsedSettings)) { // Using isArray because typeof [] === 'object'
      console.debug('Settings was array and not object, resetting.')
      setDefault()
    } else if (!validityCheck(parsedSettings)) {
      console.debug('One or more settings was of wrong type, resetting.')
      setDefault()
    } else {
      console.debug('Settings loaded successfully from localStorage.')
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
      case 'number': return !isNaN(valueToCheck) // WTF JavaScript
      default: console.error(`Unknown special type declaration '${typeFromConfig.toLowerCase()}'`)
    }
  } else {
    return typeof valueToCheck === typeFromConfig.toLowerCase() // eslint-disable-line valid-typeof
  }
}

export { loadSettings }
