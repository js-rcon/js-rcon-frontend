const fs = require('fs-extra')
const path = require('path')
const download = require('download-file')
const ora = require('ora')

configCheck()

function configCheck () {
  const checkSpinner = ora('Checking for config file src/config.js...').start()

  const configExists = fs.existsSync(path.join(process.cwd(), 'src', 'config.js'))
  const defaultConfigExists = fs.existsSync(path.join(process.cwd(), 'src', 'config.example.js'))

  if (!configExists) {
    checkSpinner.text = 'Config file src/config.js not found. Checking for default configuration file src/config.example.js...'

    if (!defaultConfigExists) {
      checkSpinner.warn('Default configuration file src/config.example.js not found.')
      downloadConfig()
    } else {
      checkSpinner.succeed('Default configuration file src/config.example.js found.')
      copyFromDefaultConfig()
    }
  } else {
    checkSpinner.succeed('Config file src/config.js found.')
    verifyFormat()
  }
}

function verifyFormat () {
  const verificationSpinner = ora('Verifying config file format...').start()

  const config = require(path.join(process.cwd(), 'src', 'config.js'))
  const defaultConfig = require(path.join(process.cwd(), 'src', 'config.example.js'))

  const failures = []

  for (let prop in defaultConfig) {
    // Using explicit undefined check to account for boolean values
    if (config[prop] === undefined) failures.push(`Configuration property "${prop}" doesn't exist.`)
    else if (typeof config[prop] !== typeof defaultConfig[prop]) failures.push(`Configuration property "${prop}" has a type mismatch. Expexted "${typeof defaultConfig[prop]}", got "${typeof config[prop]}".`)
    else if (!Array.isArray(config[prop]) && typeof config[prop] === 'object') {
      for (let subProp in defaultConfig[prop]) {
        const configProp = config[prop] // For readability
        const defaultConfigProp = defaultConfig[prop]

        if (configProp[subProp] === undefined) failures.push(`Configuration property "${prop}.${subProp}" does not exist.`)
        else if (typeof configProp[subProp] !== typeof defaultConfigProp[subProp]) failures.push(`Configuration property "${prop}.${subProp}" has a type mismatch. Expected "${typeof defaultConfigProp[subProp]}", got "${typeof configProp[subProp]}".`)
      }
    }
  }

  if (failures.length > 0) {
    verificationSpinner.fail('Errors found in config file. Spotted issues will be provided below.')
    failures.forEach(fail => console.log(`- ${fail}`))
    process.exit(1)
  } else {
    verificationSpinner.succeed('No errors found in config file. Good to go!')
    process.exit(0)
  }
}

function downloadConfig () {
  const downloadSpinner = ora('Downloading default configuration file from GitHub...').start()

  const originalConfig = 'https://raw.githubusercontent.com/js-rcon/js-rcon-frontend/master/src/config.example.js'

  const dlOptions = {
    directory: path.join(process.cwd(), 'src'),
    filename: 'config.example.js'
  }

  const fsOptions = {
    src: path.join(process.cwd(), 'src', 'config.example.js'),
    dest: path.join(process.cwd(), 'src', 'config.js')
  }

  download(originalConfig, dlOptions, err => {
    if (err) downloadSpinner.fail(`Could not download default configuration file:\n\n${err}`)
    else {
      downloadSpinner.text = 'Default configuration file downloaded into src/config.example.js. Writing src/config.js...'

      fs.copy(fsOptions.src, fsOptions.dest, err => {
        if (err) downloadSpinner.fail(`Could not write configuration file `)
      })
      downloadSpinner.succeed('Default configuration file downloaded into src/config.js. Feel free to edit any settings you need.')
    }
  })
}

function copyFromDefaultConfig () {
  const copySpinner = ora('Copying settings from "config.example.js"...').start()

  const options = {
    src: path.join(process.cwd(), 'src', 'config.example.js'),
    dest: path.join(process.cwd(), 'src', 'config.js')
  }

  fs.copy(options.src, options.dest, err => {
    if (err) copySpinner.fail(`Could not copy from src/config.example.js to src/config.js!\n\n${err}`)
    else copySpinner.succeed('Copied default configuration values from src/config.example.js to src/config.js. Feel free to edit any settings you need.')
  })
}
