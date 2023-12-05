import Cookies from 'js-cookie'

const TokenKey = 'newcowin-yunwei-backend'
const TokenPublicKey = 'newcowin-yunwei-backend-TokenPublicKey'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }
//
// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }
//
// export function getPubicKey() {
//   return Cookies.get(TokenPublicKey)
// }
//
// export function setPubicKey(token) {
//   return Cookies.set(TokenPublicKey, token)
// }
// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
export function getToken() {
  return window.localStorage.getItem(TokenKey)
  // return Cookies.get(TokenKey)
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token)
  // Cookies.set(TokenKey, token)
}

export function getPubicKey() {
  return window.localStorage.getItem(TokenPublicKey)
  // return Cookies.get(TokenPublicKey)
}

export function setPubicKey(token) {
  return window.localStorage.setItem(TokenPublicKey, token)
  // return Cookies.set(TokenPublicKey, token)
}
export function removeToken() {
  return window.localStorage.removeItem(TokenKey)
  // return Cookies.remove(TokenKey)
}
