import 'devtools-detect' // Just used for registering the global hook
import * as config from '../config'

const titleStyle = [
  'font-weight: bold',
  'font-size: 40px',
  'color: red',
  'text-shadow: 1px 1px 0px black, 1px -1px 0px black, -1px 1px 0px black, -1px -1px 0px black'
].join(';')

const textStyle = [
  'font-size: 15px'
].join(';')

function registerDevToolsHook () {
  window.addEventListener('devtoolschange', e => {
    const showCond = window.devMode ? config.enableDevToolsWarning : true
    if (showCond && e.detail.open) {
      console.clear()
      displayDevToolsWarning()
    }
  })
}

function displayDevToolsWarning () {
  console.log('%c⛔ STOP! ⛔', titleStyle)
  console.log(`%cIf someone told you to paste something here, there's a pretty decent chance you're about to get your login details scammed from you right now.`, textStyle)
  console.log(`%cUnless you know exactly what you're doing, close this window and stay safe.`, textStyle)
}

export { registerDevToolsHook }
