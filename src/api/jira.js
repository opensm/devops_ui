import request from '@/utils/request'

export function getJiras(query) {
  return request({
    url: '/jira/jiraes',
    method: 'get',
    params: query
  })
}
export function createJira(data) {
  return request({
    url: '/jira/jiraes',
    method: 'post',
    data
  })
}

export function getJira(id) {
  return request({
    url: `/jira/jira/${id}`,
    method: 'get'
  })
}

export function getJiraProjectVersionIssue(id) {
  return request({
    url: `/jira/jira_project_version/${id}`,
    method: 'get'
  })
}

export function deleteJira(id) {
  return request({
    url: `/jira/jira/${id}`,
    method: 'delete'
  })
}

export function updateJira(id, data) {
  return request({
    url: `/jira/jira/${id}`,
    method: 'put',
    data
  })
}


export function getJiraProjects(query) {
  return request({
    url: '/jira/jira_projects',
    method: 'get',
    params: query
  })
}
export function createJiraProject(data) {
  return request({
    url: '/jira/jira_projects',
    method: 'post',
    data
  })
}

export function getJiraProject(id) {
  return request({
    url: `/jira/jira_project/${id}`,
    method: 'get'
  })
}


export function deleteJiraProject(id) {
  return request({
    url: `/jira/jira_project/${id}`,
    method: 'delete'
  })
}

export function updateJiraProject(id, data) {
  return request({
    url: `/jira/jira_project/${id}`,
    method: 'put',
    data
  })
}



export function getJiraProjectVersions(query) {
  return request({
    url: '/jira/jira_project_versions',
    method: 'get',
    params: query
  })
}
export function createJiraProjectVersion(data) {
  return request({
    url: '/jira/jira_project_versions',
    method: 'post',
    data
  })
}

export function getJiraProjectVersion(id) {
  return request({
    url: `/jira/jira_project_version/${id}`,
    method: 'get'
  })
}


export function deleteJiraProjectVersion(id) {
  return request({
    url: `/jira/jira_project_version/${id}`,
    method: 'delete'
  })
}

export function updateJiraProjectVersion(id, data) {
  return request({
    url: `/jira/jira_project_version/${id}`,
    method: 'put',
    data
  })
}
