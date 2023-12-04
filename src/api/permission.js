import request from '@/utils/request'

export function getPermissionList(query) {
  return request({
    url: '/auth/permissions',
    method: 'get',
    params: query
  })
}

export function createPermission(data) {
  return request({
    url: '/auth/permissions',
    method: 'post',
    data
  })
}
export function deletePermission(id) {
  return request({
    url: `/auth/permission/${id}`,
    method: 'delete'
  })
}

export function updatePermission(id, data) {
  return request({
    url: `/auth/permission/${id}`,
    method: 'put',
    data
  })
}
