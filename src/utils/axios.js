import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { FormError } from './error'
import store from '@/store'

const config = {
  baseURL: '/api',
  timeout: 6000,
  withCredentials: true
}

const service = axios.create(config)

let tictoc = false // 由于element-ui 表单验证是使用watch监听,如果错误提示字符串不变,它不会再次提醒错误,所以设置标志位

service.interceptors.request.use(request => request, error => Promise.reject(error))

const handleResponseError = error => {
  const { response = {} } = error
  const status = String(response.status)
  const data = response.data
  // 5xx error
  if(status[0] === '5') {
    Message({
      message: '服务器错误',
      type: 'error'
    })
    return Promise.reject(new Error('5xx_SERVER_ERROR'))
  } else if(status === '403') {
    const detail = data ? data.detail : undefined
    // 未登陆或者cookies过期
    if(detail === 'Authentication credentials were not provided') {
      store.dispatch('user/resetInfo').then(() => {
        location.reload()
      })
    }
    // 考试模式下IP不一致
    else if (detail === 'Inconsistent IP!') {
      MessageBox.confirm('IP不一致，请找管理员重置IP之后再尝试登陆', '注销确认', {
        confirmButtonText: '重新登陆',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetInfo').then(() => {
          location.reload()
        })
      })
    }
    Message({message: '无权访问',type: 'error'})
    return Promise.reject(new Error(detail || '403_NOT_AUTH'))
  } else if (status === '400') {
    Object.keys(data).forEach(key => {
      data[key] = (Array.isArray(data[key])
      ? data[key][0]
      : data[key]) + (tictoc ? '' : ' ')
    })
    tictoc = !tictoc
    return Promise.reject(new FormError(data))
  } else if(status === '404') {
    Message({ message: '资源获取失败', type: 'error'})
    return Promise.reject(new Error('404_NOT_FOUND'))
  } else if(status === '429') {
    Message({ message: '您访问太过频繁, 已被限速', type: 'error'})
    return Promise.reject(new Error('429_ACCESS_RESTRICTIONS'))
  } else {
    Message({ message: '客户端错误', type: 'error'})
    return Promise.reject(new Error('UNKNOW_ERROR'))
  }
}

service.interceptors.response.use(response => response.data, handleResponseError)

export default service
