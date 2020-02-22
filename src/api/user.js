import ajax from '@/utils/ajax'

export function login(data) {
  return ajax.post('users/login/', data)
}

export function logout() {
  return ajax.get('users/logout/')
}

export function getInfo(id) {
  return ajax.get(`users/${id}/`)
}

export function updatePassword(data) {
  return ajax.post('users/change-password/', data)
}

export function updateProfile(id, data) {
  return ajax.patch(`users/${id}/`, data)
}
