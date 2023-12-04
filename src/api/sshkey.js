import request from '@/utils/request'

export function getSshKeyList(query) {
  return request({
    url: '/config/sshkeys',
    method: 'get',
    params: query
  })
}

export function createSshKey(data) {
  return request({
    url: '/config/sshkeys',
    method: 'post',
    data
  })
}
export function deleteSshKey(id) {
  return request({
    url: `/config/sshkey/${id}`,
    method: 'delete'
  })
}

export function updateSshKey(id, data) {
  return request({
    url: `/config/sshkey/${id}`,
    method: 'put',
    data
  })
}
