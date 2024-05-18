import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const Username = 'Username'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setCookieUsername(username) {
  return Cookies.set(Username, username)
}

export function removeToken() {
  return Cookies.remove(TokenKey, Username)
}
