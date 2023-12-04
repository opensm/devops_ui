import request from '@/utils/request'

export function getldapList(query) {
  return request({
    url: '/auth/ldaps',
    method: 'get',
    params: query
  })
}

export function createldap(data) {
  return request({
    url: '/auth/ldaps',
    method: 'post',
    data
  })
}
export function deleteldap(id) {
  return request({
    url: `/auth/ldap/${id}`,
    method: 'delete'
  })
}

export function updateldap(id, data) {
  return request({
    url: `/auth/ldap/${id}`,
    method: 'put',
    data
  })
}
