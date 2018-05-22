import * as SA from 'superagent'
import * as config from '../config'
import { emitOne } from './dispatcher'
import { decryptToken } from './encryption'

// In development, use configured API URL - in production both run on localhost
const url = `http://localhost:${window.location.port}`
const apiUrl = process.env.NODE_ENV === 'development' ? config.apiUrl : url

async function status () {
  let status = {
    loggedIn: false,
    username: null,
    token: null,
    error: null
  }

  const token = decryptToken(sessionStorage.getItem('token'))

  await SA
    .get(`${apiUrl}/status`)
    .set({
      ContentType: 'application/json',
      Accept: 'application/json',
      token: token && token.length > 0 ? token : 'null'
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
    .post(`${apiUrl}/auth`)
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
