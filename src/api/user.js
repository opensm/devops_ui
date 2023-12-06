import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}
export function publicKey() {
  return request({
    url: '/auth/publickey',
    method: 'get'
  })
}

export function refresh() {
  return request({
    url: '/auth/refresh',
    method: 'post'
  })
}

export function logout() {
  return request({
    url: '/auth/user/logout',
    method: 'post'
  })
}

export function getUsers() {
  return request({
    url: '/auth/users',
    method: 'get'
  })
}
export function createUser(data) {
  return request({
    url: '/auth/users',
    method: 'post',
    data
  })
}

export function updateUser(id, data) {
  return request({
    url: `/auth/user/${id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/auth/user/${id}`,
    method: 'delete'
  })
}
