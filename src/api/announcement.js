import ajax from '@/utils/ajax'

export function getAnnouncement() {
  return ajax.get('/announcement/1/')
}
