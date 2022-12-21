import request from '@/utils/request'

export function getKubernetesList(query) {
  return request({
    url: '/order/kubernetes/auth',
    method: 'get',
    params: query
  })
}

export function createKubernetes(data) {
  return request({
    url: '/order/kubernetes/auth',
    method: 'post',
    data
  })
}
export function deleteKubernetes(data) {
  return request({
    url: `/order/kubernetes/auth?id=${data}`,
    method: 'delete'
  })
}

export function updateKubernetes(data) {
  return request({
    url: `/order/kubernetes/auth`,
    method: 'put',
    data
  })
}
