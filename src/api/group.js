import ajax from '@/utils/ajax'

export function getGroups() {
  return ajax.get('groups/')
}

export function getGroup(id) {
  return ajax.get(`groups/${id}/`)
}
