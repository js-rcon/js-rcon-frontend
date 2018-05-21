import SimpleCryptoJS from 'simple-crypto-js'

function encryptToken (plainTextToken) {
  const secret = SimpleCryptoJS.generateRandom(256)
  const crypto = new SimpleCryptoJS(secret)
  return `${crypto.encrypt(plainTextToken)}:${secret}`
}

function decryptToken (encryptedToken) {
  // Split and assign bits of the stored token
  const tokenAndSecret = encryptedToken.split(':')
  const token = tokenAndSecret[0]
  const secret = tokenAndSecret[1]

  const crypto = new SimpleCryptoJS(secret)
  return crypto.decrypt(token)
}

export { encryptToken, decryptToken }
