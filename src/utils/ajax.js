import service from './axios'

export default {
  post: function(url, data) {
    return service({ url, method: 'post', data })
  },
  get: function(url, params) {
    return service({ url, method: 'get', params })
  },
  put: function(url, data) {
    return service({ url, method: 'put', data })
  },
  delete: function(url) {
    return service({ url, method: 'delete' })
  },
  patch: function(url, data) {
    return service({ url, method: 'patch', data })
  },
}
