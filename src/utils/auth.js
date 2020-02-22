import {setLocalStorage, getLocalStorage, removeLocalStorage} from './storage'

export function getUserid() {
  return getLocalStorage('userid')
}

export function setUserid(id) {
  setLocalStorage('userid', String(id))
}
