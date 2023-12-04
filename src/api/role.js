import request from '@/utils/request'

export function getRoleList(query) {
  return request({
    url: '/auth/roles',
    method: 'get',
    params: query
  })
}

export function createRole(data) {
  return request({
    url: '/auth/roles',
    method: 'post',
    data
  })
}
export function deleteRole(id) {
  return request({
    url: `/auth/role/${id}`,
    method: 'delete'
  })
}

export function updateRole(id, data) {
  return request({
    url: `/auth/role/${id}`,
    method: 'put',
    data
  })
}
