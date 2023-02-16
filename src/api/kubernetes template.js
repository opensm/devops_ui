import request from '@/utils/request'

export function getTemplateList(query) {
  return request({
    url: '/order/kubernetes/template',
    method: 'get',
    params: query
  })
}

export function createTemplate(data) {
  return request({
    url: '/order/kubernetes/template',
    method: 'post',
    data
  })
}
export function deleteTemplate(data) {
  return request({
    url: `/order/kubernetes/template?id=${data}`,
    method: 'delete'
  })
}

export function updateTemplate(data) {
  return request({
    url: `/order/kubernetes/template`,
    method: 'put',
    data
  })
}
