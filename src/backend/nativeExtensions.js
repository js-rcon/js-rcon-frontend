/* eslint-disable no-extend-native */

// Polyfill to globalise String.prototype.replace
String.prototype.replaceAll = function (searchString, replaceString) {
  return this.split(searchString).join(replaceString)
}

// Allow getting multiple HTML elements with a single function call
Document.prototype.getElementsById = elementIdArray => {
  if (!Array.isArray(elementIdArray)) console.error(`Invalid parameter type '${typeof elementIdArray}' submitted to getElementsById, expected 'array'`)
  else {
    return elementIdArray.map(elementId => {
      if (typeof elementId !== 'string') console.error(`Ignoring invalid element ID '${elementId}' in getElementsById, was of type '${typeof elementId}' not 'string'`)
      else return document.getElementById(elementId)
    })
  }
}

// Remove multiple items from sessionStorage at once
Storage.prototype.removeItems = itemIdArray => {
  if (!Array.isArray(itemIdArray)) console.error(`Invalid parameter type '${typeof elementIdArray}' submitted to removeItems, expected 'array'`)
  else {
    itemIdArray.forEach(item => {
      if (typeof item !== 'string') console.error(`Ignoring invalid element ID '${item}' in removeItems, was of type '${typeof elementId}' not 'string'`)
      else sessionStorage.removeItem(item)
    })
  }
}

window.devMode = process.env && process.env.NODE_ENV === 'development'
