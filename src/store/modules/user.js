import { login, logout, getInfo } from '@/api/user'
import { setUserid, getUserid } from '@/utils/auth'
import { clearLocalStorage } from '@/utils/storage'
import { resetRouter } from '@/router'

const state = {
  username: '',
  userid: '',
  permission: -1,
  name: '',
  nickname: '',
}

const mutations = {
  SET_PERMISSION: (state, permission) => {
    permission = Number(permission)
    state.permission = permission
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_USERINFO: (state, userinfo) => {
    const { id, username, permission, name, nickname } = userinfo
    state.permission = permission
    state.username = username
    state.userid = id
    state.name = name
    state.nickname = nickname
  },
}

const actions = {
  // user login
  login({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      login({ username, password })
        .then(response => {
          clearLocalStorage()
          setUserid(response.id)
          commit('SET_USERID', response.id)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const id = state.userid || getUserid()
      if (!id) reject('no user id exists')
      getInfo(id)
        .then(response => {
          setUserid(response.id)
          commit('SET_USERINFO', response)
          resolve(response)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          setUserid('')
          commit('SET_USERINFO', {
            username: '',
            userid: '',
            permission: -1,
          }) // reset userinfo
          resetRouter()
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  resetInfo({ commit }) {
    return new Promise(resolve => {
      setUserid('')
      commit('SET_USERINFO', {
        username: '',
        userid: '',
        permission: -1,
      }) // reset userinfo
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
