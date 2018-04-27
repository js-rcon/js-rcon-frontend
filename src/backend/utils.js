/**
 * Write multiple items to the session storage simultaneously.
 * @param {Array} items - Key-value pairs with notation 'name:value'.
 */
function writeToSessionStorage (items) {
  if (!Array.isArray(items)) throw new Error('Parameter \'items\' must be of type \'Array\'')
  else {
    items.map(i => {
      if (!i.includes(':')) console.warn(`Ignoring malformed item ${i} in writeToSessionStorage`)
      else {
        let keyAndValue = i.split(':')
        sessionStorage.setItem(keyAndValue[0], keyAndValue[1])
      }
    })
  }
}

/**
 * Remove multiple items from the session storage simultaneously.
 * @param {Array} items - Item names to remove.
 */
function removeFromSessionStorage (items) {
  if (!Array.isArray(items)) throw new Error('Parameter \'items\' must be of type \'Array\'')
  else {
    items.map(i => {
      sessionStorage.removeItem(i)
    })
  }
}

export { writeToSessionStorage, removeFromSessionStorage }
