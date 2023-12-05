import { login, refresh } from '@/api/user'
import { getToken, setToken, removeToken, setPubicKey } from '@/utils/auth'
import { resetRouter } from '@/router'
import { jwtDecode } from 'jwt-decode'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    publickey: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
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
        const { access, public_key } = response.data
        commit('SET_TOKEN', `Bearer ${access}`)
        commit('SET_PUBLICKEY', public_key)
        setToken(`Bearer ${access}`)
        setPubicKey(`${public_key}`)
        const { name } = jwtDecode(access)
        commit('SET_NAME', name)
        commit('SET_AVATAR', 'https://pic1.zhimg.com/80/v2-d327ca21ec78d29675b0b500607e2440_720w.webp')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  refresh({ commit }) {
    return new Promise((resolve, reject) => {
      refresh().then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { username } = data

        commit('SET_NAME', username)
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

  // user logout
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout(state.token).then(() => {
  //       removeToken() // must remove  token  first
  //       resetRouter()
  //       commit('RESET_STATE')
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

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

