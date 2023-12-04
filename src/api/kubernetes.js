import request from '@/utils/request'

export function getKubernetesList(query) {
  return request({
    url: '/config/kubernetes',
    method: 'get',
    params: query
  })
}

export function createKubernetes(data) {
  return request({
    url: '/config/kubernetes',
    method: 'post',
    data
  })
}
export function deleteKubernetes(id) {
  return request({
    url: `/config/kubernetes_info/${id}`,
    method: 'delete'
  })
}

export function updateKubernetes(id, data) {
  return request({
    url: `/config/kubernetes_info/${id}`,
    method: 'put',
    data
  })
}

export function getKubernetes(id) {
  return request({
    url: `/config/kubernetes_info/${id}`,
    method: 'get'
  })
}
