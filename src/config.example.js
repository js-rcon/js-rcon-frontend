// Developer configuration file

const config = {}

config.apiUrl = 'http://localhost:8080'

config.settingsTypes = {
  darkThemeEnabled: {
    type: 'boolean'
  },
  autoProtectEnabled: {
    type: 'boolean'
  },
  defaultView: {
    type: 'string',
    acceptedValues: ['tools', 'users', 'console']
  }
}

module.exports = config
