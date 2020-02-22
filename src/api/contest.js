import ajax from '@/utils/ajax'

export function getContests(params) {
  return ajax.get('contests/', params)
}

export function getContest(id) {
  return ajax.get(`contests/${id}/`)
}

export function createCodeSubmission(data) {
  return ajax.post('code-submission/', data)
}

export function getCodeSubmissions(params) {
  return ajax.get('code-submission/', params)
}

export function getCodeSubmission(id) {
  return ajax.get(`code-submission/${id}/`)
}

export function getCodeFillSubmission(id) {
  return ajax.get(`/code-fill-submission/${id}/`)
}

export function createCodeFillSubmission(data) {
  return ajax.post(`/code-fill-submission/`, data)
}

export function getCodeFillSubmissions(params) {
  return ajax.get(`/code-fill-submission/`, params)
}

export function getContestSubmissions(params) {
  return ajax.get(`contest-submission/`, params)
}

export function getContestSubmission(id) {
  return ajax.get(`/contest-submission/${id}/`)
}

export function getRank(id, params) {
  return ajax.get(`/contests/${id}/rank/`, params)
}

export function checkContestSubmission(id) {
  return ajax.get(`/contest-submission/?contest=${id}`)
}

export function createContestSubmission(data) {
  return ajax.post(`/contest-submission/`, data)
}

export function updateContestSubmission(id) {
  return data => ajax.patch(`/contest-submission/${id}/`, data)
}

export function getQASubmission(id) {
  return ajax.get(`/qa-submission/${id}/`)
}
