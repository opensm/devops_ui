import request from '@/utils/request'

export function getServiceConfigList(query) {
  return request({
    url: '/config/service_configs',
    method: 'get',
    params: query
  })
}

export function createServiceConfig(data) {
  return request({
    url: '/config/service_configs',
    method: 'post',
    data
  })
}
export function deleteServiceConfig(id) {
  return request({
    url: `/config/service_config/${id}`,
    method: 'delete'
  })
}

export function updateServiceConfig(id, data) {
  return request({
    url: `/config/service_config/${id}`,
    method: 'put',
    data
  })
}
export function getServiceConfig(id) {
  return request({
    url: `/config/service_config/${id}`,
    method: 'get'
  })
}

export function getServiceList(query) {
  return request({
    url: '/config/services',
    method: 'get',
    params: query
  })
}

export function createService(data) {
  return request({
    url: '/config/services',
    method: 'post',
    data
  })
}
export function deleteService(id) {
  return request({
    url: `/config/service/${id}`,
    method: 'delete'
  })
}
export function getService(id) {
  return request({
    url: `/config/service/${id}`,
    method: 'get'
  })
}

export function updateService(id, data) {
  return request({
    url: `/config/service/${id}`,
    method: 'put',
    data
  })
}

export function getServiceResourceList(query) {
  return request({
    url: '/config/service_resources',
    method: 'get',
    params: query
  })
}

export function createServiceResource(data) {
  return request({
    url: '/config/service_resources',
    method: 'post',
    data
  })
}
export function deleteServiceResource(id) {
  return request({
    url: `/config/service_resource/${id}`,
    method: 'delete'
  })
}

export function updateServiceResource(id, data) {
  return request({
    url: `/config/service_resource/${id}`,
    method: 'put',
    data
  })
}
