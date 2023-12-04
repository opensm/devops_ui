import request from '@/utils/request'

export function getProjectList(query) {
  return request({
    url: '/config/projects',
    method: 'get',
    params: query
  })
}

export function createProject(data) {
  return request({
    url: '/config/projects',
    method: 'post',
    data
  })
}
export function deleteProject(id) {
  return request({
    url: `/config/project/${id}`,
    method: 'delete'
  })
}

export function updateProject(id, data) {
  return request({
    url: `/config/project/${id}`,
    method: 'put',
    data
  })
}
