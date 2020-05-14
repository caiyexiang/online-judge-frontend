import { STORAGE_PREFIX } from './constant'

const getStorageKey = key => `${STORAGE_PREFIX}-${key}`

export function setLocalStorage(key, value) {
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw TypeError('localStorage: argument key should be string or number type')
  }
  value = value ? value : '' // 因为 localStorage 在无此key下返回null，其他情况下把值转为字符串。因此若要存储布尔值为否的东西同一转化为空字符串。
  window.localStorage.setItem(getStorageKey(key), value)
}
export function getLocalStorage(key) {
  if (typeof key !== 'string' && typeof key !== 'number') {
    throw TypeError('localStorage: argument key should be string or number type')
  }
  const data = window.localStorage.getItem(getStorageKey(key))
  return data ? data : false
}
export function removeLocalStorage(key) {
  if (!getLocalStorage(key)) {
    return false
  }
  window.localStorage.removeItem(getStorageKey(key))
  return true
}
export function clearLocalStorage() {
  window.localStorage.clear()
}
export function getCookie(key) {
  return (
    decodeURIComponent(
      document.cookie.replace(
        new RegExp(
          '(?:(?:^|.*;)\\s*' + encodeURIComponent(key).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$',
        ),
        '$1',
      ),
    ) || null
  )
}
