import * as SA from 'superagent'
import * as config from '../config'
import { emitOne } from './dispatcher'

async function status () {
  let status = {
    loggedIn: false,
    username: null,
    token: null,
    error: null
  }

  await SA
    .get(`${config.api.url}/status`)
    .set({
      ContentType: 'application/json',
      Accept: 'application/json',
      token: sessionStorage.getItem('token')
    })
    .then(res => {
      if (res.status === 200 && res.body.username) {
        status = {
          loggedIn: true,
          username: res.body.username,
          token: res.body.token,
          error: null
        }
      }
    })
    .catch(err => {
      status.error = err

      emitOne('REQUEST_ERROR_OVERLAY', {
        error: err,
        msg: err.message,
        code: 'Ghost'
      })
    })
  return status
}

async function login (username, password) {
  let status = {
    loggedIn: false,
    username: null,
    token: null,
    error: null
  }

  await SA
    .post(`${config.api.url}/auth`)
    .set({
      ContentType: 'application/json',
      Accept: 'application/json'
    })
    .send({
      username: username,
      password: password
    })
    .then(res => {
      if (res.status === 200 && res.body.username) {
        status = {
          loggedIn: true,
          username: res.body.username,
          token: res.body.token,
          error: null
        }
      }
    })
    .catch(err => {
      status.error = err

      // 401s are already handled client-side
      if (err.status === 401) {} // eslint-disable-line brace-style
      else {
        emitOne('REQUEST_ERROR_OVERLAY', {
          error: err,
          msg: err.message,
          code: 'Ghost'
        })
      }
    })
  return status
}

export { status, login }
