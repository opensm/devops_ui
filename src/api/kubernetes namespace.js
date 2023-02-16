import request from '@/utils/request'

export function getNamespaceList(query) {
  return request({
    url: '/order/kubernetes/namespace',
    method: 'get',
    params: query
  })
}

export function deleteNamespace(data) {
  return request({
    url: `/order/kubernetes/namespace?id=${data}`,
    method: 'delete'
  })
}

export function updateNamespace(data) {
  return request({
    url: `/order/kubernetes/namespace`,
    method: 'put',
    data
  })
}
