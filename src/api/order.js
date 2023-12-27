import request from '@/utils/request'

export function getContentType(query) {
  return request({
    url: '/order/content_type',
    method: 'get',
    params: query
  })
}

export function getOrderList(query) {
  return request({
    url: '/order/orders',
    method: 'get',
    params: query
  })
}

export function getOrder(id) {
  return request({
    url: `/order/order/${id}`,
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/order/orders',
    method: 'post',
    data
  })
}
export function deleteOrder(id) {
  return request({
    url: `/order/order/${id}`,
    method: 'delete'
  })
}

export function updateOrder(id, data) {
  return request({
    url: `/order/order/${id}`,
    method: 'put',
    data
  })
}

export function getJenkinsOrders() {
  return request({
    url: `/order/jenkins_orders`,
    method: 'get'
  })
}
export function getJenkinsOrder(id) {
  return request({
    url: `/order/jenkins_order/${id}`,
    method: 'get'
  })
}

export function createJenkinsOrder(data) {
  return request({
    url: '/order/jenkins_orders',
    method: 'post',
    data
  })
}
