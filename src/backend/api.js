import * as SA from 'superagent'
import * as config from '../config'

async function status () {
  let status = {
    loggedIn: false,
    error: null
  }

  await SA
    .get(`${config.api.url}/status`)
    .set({
      ContentType: 'application/json',
      Accept: 'application/json',
      credentials: 'include'
    })
    .then(res => {
      if (res.status === 200 && res.body.username) status = { loggedIn: true, username: res.body.username, error: null }
      else status = { loggedIn: false, username: null, error: null } // TODO: Display this in the UI
    })
    .catch(err => {
      status = { loggedIn: false, error: err }
      console.error('Unexpected HTTP request error: ' + err)
    })
  return status
}

async function login (username, password) {
  let status = {
    loggedIn: false,
    error: null
  }

  await SA
    .post(`${config.api.url}/auth`)
    .set({
      ContentType: 'application/x-www-form-urlencoded'
    })
    .send({
      username: username,
      password: password
    })
    .then(res => {
      if (res.status === 200 && res.body.username) status = { loggedIn: true, username: res.body.username, error: null }
    })
    .catch(err => {
      status = { loggedIn: false, username: null, error: err }

      // TODO: Display this in the UI
      // Ignoring 401s in catch because it is harmless and handled client-side
      if (err.status === 401) {} // eslint-disable-line brace-style
      else console.error('Unexpected HTTP request error: ' + err)
    })
  return status
}

export { status, login }
