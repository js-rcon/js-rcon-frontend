// Developer configuration file

const config = {
  apiUrl: 'http://localhost:8080',
  defaultSettings: {
    darkThemeEnabled: false,
    autoProtectEnabled: false,
    defaultView: 'tools'
  },
  settingsTypes: {
    darkThemeEnabled: 'boolean',
    autoProtectEnabled: 'boolean',
    defaultView: 'string'
  },
  enableDevToolsWarning: true
}

module.exports = config
