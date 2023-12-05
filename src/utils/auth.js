import Cookies from 'js-cookie'

const TokenKey = 'newcowin-yunwei-backend'
const TokenPublicKey = 'newcowin-yunwei-backend-TokenPublicKey'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getPubicKey() {
  return Cookies.get(TokenPublicKey)
}

export function setPubicKey(token) {
  return Cookies.set(TokenPublicKey, token)
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
