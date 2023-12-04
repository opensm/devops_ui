import request from '@/utils/request'

export function getEnvironmentList(query) {
  return request({
    url: '/config/environments',
    method: 'get',
    params: query
  })
}

export function createEnvironment(data) {
  return request({
    url: '/config/environments',
    method: 'post',
    data
  })
}
export function deleteEnvironment(id) {
  return request({
    url: `/config/environment/${id}`,
    method: 'delete'
  })
}

export function updateEnvironment(id, data) {
  return request({
    url: `/config/environment/${id}`,
    method: 'put',
    data
  })
}
