import { STORAGE_PREFIX } from './constant'

const getStorageKey = (key) => `${STORAGE_PREFIX}-${key}`

export function setLocalStorage (key, value) {
  if (typeof key !== 'string') {
    throw TypeError('localStorage: argument key should be string type')
  }
  value = value ? value : '' // 因为 localStorage 在无此key下返回null，其他情况下把值转为字符串。因此若要存储布尔值为否的东西同一转化为空字符串。
  window.localStorage.setItem(getStorageKey(key), value)
}
export function getLocalStorage (key) {
  if (typeof key !== 'string') {
    throw TypeError('localStorage: argument key should be string type')
  }
  const data = window.localStorage.getItem(getStorageKey(key))
  return data ? data : false
}
export function removeLocalStorage (key) {
  if(!getLocalStorage(key)) {
    return false
  }
  window.localStorage.removeItem(key)
  return true
}
