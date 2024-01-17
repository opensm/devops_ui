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

export function getldapGroupList(query) {
  return request({
    url: '/auth/ldap_groups',
    method: 'get',
    params: query
  })
}

export function createLdapGroup(data) {
  return request({
    url: '/auth/ldap_groups',
    method: 'post',
    data
  })
}
export function deleteLdapGroup(id) {
  return request({
    url: `/auth/ldap_group/${id}`,
    method: 'delete'
  })
}

export function updateLdapGroup(id, data) {
  return request({
    url: `/auth/ldap_group/${id}`,
    method: 'put',
    data
  })
}
