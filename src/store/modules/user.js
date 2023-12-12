import { login, refresh } from '@/api/user'
import { getToken, setToken, removeToken, setPubicKey, getPubicKey } from '@/utils/auth'
import { resetRouter } from '@/router'
import { jwtDecode } from 'jwt-decode'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    roles: '',
    avatar: '',
    publickey: '',
    userid: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_ID: (state, userid) => {
    state.userid = userid
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PUBLICKEY: (state, publickey) => {
    state.publickey = publickey
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, ldap } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, ldap: ldap }).then(response => {
        const { access } = response.data
        const { public_key } = response
        // const { name } = jwtDecode(access)
        commit('SET_TOKEN', `Bearer ${access}`)
        commit('SET_PUBLICKEY', public_key)
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', 'https://pic1.zhimg.com/80/v2-d327ca21ec78d29675b0b500607e2440_720w.webp')
        // commit('SET_ROLES', ['admin'])
        setToken(`Bearer ${access}`)
        setPubicKey(`${public_key}`)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      const public_key = getPubicKey()
      const access = getToken()
      const data = jwtDecode(access)
      const { name, user_id, roles } = data
      commit('SET_TOKEN', `Bearer ${access}`)
      commit('SET_PUBLICKEY', public_key)
      commit('SET_ID', user_id)
      commit('SET_NAME', name)
      commit('SET_AVATAR', 'https://pic1.zhimg.com/80/v2-d327ca21ec78d29675b0b500607e2440_720w.webp')
      commit('SET_ROLES', roles)
      // commit('SET_ROLES', ['admin'])
      resolve(data)
    })
  },

  refresh({ commit }) {
    return new Promise((resolve, reject) => {
      refresh().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', 'https://pic1.zhimg.com/80/v2-d327ca21ec78d29675b0b500607e2440_720w.webp')
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  logout({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

