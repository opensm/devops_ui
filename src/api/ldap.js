import request from '@/utils/request'

export function getldapList(query) {
  return request({
    url: '/auth/user/ldap',
    method: 'get',
    params: query
  })
}

export function createldap(data) {
  return request({
    url: '/auth/user/ldap',
    method: 'post',
    data
  })
}
export function deleteldap(data) {
  return request({
    url: `/auth/user/ldap?id=${data}`,
    method: 'delete'
  })
}

export function updateldap(data) {
  return request({
    url: `/auth/user/ldap`,
    method: 'put',
    data
  })
}
