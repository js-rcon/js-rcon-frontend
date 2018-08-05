function loadSettings () {
  // Pre-flight check that settings are initiated and not malformed
  const settings = JSON.parse(localStorage.getItem('settings'))
  const formatRules = !Array.isArray(settings) && typeof settings !== 'object' // Using isArray because [] and {} are both objects

  if (!settings || !formatRules) localStorage.setItem('settings', JSON.stringify({}))

  validityCheck(settings)
}

// TODO
const settingTypes = {
  
}

function validityCheck (settingsObject) {
  
}
