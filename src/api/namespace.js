import request from '@/utils/request'

export function getNamespaceList(query) {
  return request({
    url: '/order/kubernetes/namespace',
    method: 'get',
    params: query
  })
}

export function RsyncNamespace(id) {
  return request({
    url: `/order/kubernetes/namespace_rsync?id=${id}`,
    method: 'get'
  })
}
