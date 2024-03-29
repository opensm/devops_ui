import request from '@/utils/request'

export function getKubernetesEnvironmentConfigurationList(query) {
  return request({
    url: '/config/kubernetes_environment_configurations',
    method: 'get',
    params: query
  })
}

export function createKubernetesEnvironmentConfiguration(data) {
  return request({
    url: '/config/kubernetes_environment_configurations',
    method: 'post',
    data
  })
}
export function deleteKubernetesEnvironmentConfiguration(id) {
  return request({
    url: `/config/kubernetes_environment_configuration/${id}`,
    method: 'delete'
  })
}

export function updateKubernetesEnvironmentConfiguration(id, data) {
  return request({
    url: `/config/kubernetes_environment_configuration/${id}`,
    method: 'put',
    data
  })
}

export function getDockerEnvironmentConfigurationList(query) {
  return request({
    url: '/config/docker_environment_configurations',
    method: 'get',
    params: query
  })
}

export function createDockerEnvironmentConfiguration(data) {
  return request({
    url: '/config/docker_environment_configurations',
    method: 'post',
    data
  })
}
export function deleteDockerEnvironmentConfiguration(id) {
  return request({
    url: `/config/docker_environment_configuration/${id}`,
    method: 'delete'
  })
}

export function updateDockerEnvironmentConfiguration(id, data) {
  return request({
    url: `/config/docker_environment_configuration/${id}`,
    method: 'put',
    data
  })
}

export function getServiceEnvironmentList(query) {
  return request({
    url: '/config/service_environments',
    method: 'get',
    params: query
  })
}

export function createServiceEnvironment(data) {
  return request({
    url: '/config/service_environments',
    method: 'post',
    data
  })
}
export function deleteServiceEnvironment(id) {
  return request({
    url: `/config/service_environment/${id}`,
    method: 'delete'
  })
}

export function updateServiceEnvironment(id, data) {
  return request({
    url: `/config/service_environment/${id}`,
    method: 'put',
    data
  })
}

export function getKubernetesHelmRepoList(query) {
  return request({
    url: '/config/kubernetes_helm_repos',
    method: 'get',
    params: query
  })
}

export function createKubernetesHelmRepo(data) {
  return request({
    url: '/config/kubernetes_helm_repos',
    method: 'post',
    data
  })
}
export function deleteKubernetesHelmRepo(id) {
  return request({
    url: `/config/kubernetes_helm_repo/${id}`,
    method: 'delete'
  })
}

export function updateKubernetesHelmRepo(id, data) {
  return request({
    url: `/config/kubernetes_helm_repo/${id}`,
    method: 'put',
    data
  })
}

export function getKubernetesHelmChartList(query) {
  return request({
    url: '/config/kubernetes_helm_charts',
    method: 'get',
    params: query
  })
}

export function createKubernetesHelmChart(data) {
  return request({
    url: '/config/kubernetes_helm_charts',
    method: 'post',
    data
  })
}
export function deleteKubernetesHelmChart(id) {
  return request({
    url: `/config/kubernetes_helm_chart/${id}`,
    method: 'delete'
  })
}

export function updateKubernetesHelmChart(id, data) {
  return request({
    url: `/config/kubernetes_helm_chart/${id}`,
    method: 'put',
    data
  })
}

export function getProductList(query) {
  return request({
    url: '/config/products',
    method: 'get',
    params: query
  })
}
export function getContents(query) {
  return request({
    url: '/config/contents',
    method: 'get',
    params: query
  })
}
export function getProduct(id) {
  return request({
    url: `/config/product/${id}`,
    method: 'get'
  })
}

export function createProduct(data) {
  return request({
    url: '/config/products',
    method: 'post',
    data
  })
}
export function deleteProduct(id) {
  return request({
    url: `/config/product/${id}`,
    method: 'delete'
  })
}

export function updateProduct(id, data) {
  return request({
    url: `/config/product/${id}`,
    method: 'put',
    data
  })
}

export function getDBList(query) {
  return request({
    url: '/config/dbs',
    method: 'get',
    params: query
  })
}

export function createDB(data) {
  return request({
    url: '/config/dbs',
    method: 'post',
    data
  })
}
export function deleteDB(id) {
  return request({
    url: `/config/db/${id}`,
    method: 'delete'
  })
}

export function updateDB(id, data) {
  return request({
    url: `/config/db/${id}`,
    method: 'put',
    data
  })
}

export function getNoticeList(query) {
  return request({
    url: '/config/notices',
    method: 'get',
    params: query
  })
}

export function createNotice(data) {
  return request({
    url: '/config/notices',
    method: 'post',
    data
  })
}
export function deleteNotice(id) {
  return request({
    url: `/config/notice/${id}`,
    method: 'delete'
  })
}

export function updateNotice(id, data) {
  return request({
    url: `/config/notice/${id}`,
    method: 'put',
    data
  })
}

export function getNaCOSList(query) {
  return request({
    url: '/config/nacoses',
    method: 'get',
    params: query
  })
}

export function createNaCOS(data) {
  return request({
    url: '/config/nacoses',
    method: 'post',
    data
  })
}
export function deleteNaCOS(id) {
  return request({
    url: `/config/nacos/${id}`,
    method: 'delete'
  })
}

export function updateNaCOS(id, data) {
  return request({
    url: `/config/nacos/${id}`,
    method: 'put',
    data
  })
}

export function getEnvironmentVariables(query) {
  return request({
    url: '/config/environment_variables',
    method: 'get',
    params: query
  })
}

export function createEnvironmentVariable(data) {
  return request({
    url: '/config/environment_variables',
    method: 'post',
    data
  })
}
export function deleteEnvironmentVariable(id) {
  return request({
    url: `/config/environment_variable/${id}`,
    method: 'delete'
  })
}

export function updateEnvironmentVariable(id, data) {
  return request({
    url: `/config/environment_variable/${id}`,
    method: 'put',
    data
  })
}


export function getJenkinsAll(query) {
  return request({
    url: '/config/jenkins_all',
    method: 'get',
    params: query
  })
}

export function createJenkins(data) {
  return request({
    url: '/config/jenkins_all',
    method: 'post',
    data
  })
}
export function deleteJenkins(id) {
  return request({
    url: `/config/jenkins/${id}`,
    method: 'delete'
  })
}

export function updateJenkins(id, data) {
  return request({
    url: `/config/jenkins/${id}`,
    method: 'put',
    data
  })
}
