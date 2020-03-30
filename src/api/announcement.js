import ajax from '@/utils/ajax'

export function getAnnouncement(id) {
  return ajax.get(`/announcement/${id}/`)
}
