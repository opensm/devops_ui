/* Layout */
import Layout from '@/layout'

// import da from "element-ui/src/locale/lang/da";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

export const loadView = (view) => { // 路由懒加载
  return (resolve) => require(['@/views' + view], resolve)
}
/**
 *将后台的路由表进行格式化
 * @param {*} asyncRouterMap
 */
function convertRouter(asyncRouterMap) {
  const accessedRouters = []
  if (asyncRouterMap) {
    asyncRouterMap.forEach(item => {
      if (item.path === '/') {
        return
      }
      const parent = generateRouter(item, true, '')
      const children = []
      if (item.children) {
        item.children.forEach(child => {
          children.push(generateRouter(child, false, parent.path))
        })
        parent.children = children
      }
      accessedRouters.push(parent)
    })
  }
  accessedRouters.push({
    path: '*', redirect: '/404', hidden: true
  })
  return accessedRouters
}

function generateRouter(item, isParent, parentPath) {
  const childPath = parentPath + '/' + item.path
  return {
    path: item.path === '/' ? '/' : childPath,
    name: item.name,
    hidden: item.hidden,
    meta: {
      title: item.name, icon: item.icon
    },
    // component: isParent ? Layout : componentsMap[item.path]
    component: isParent ? Layout : loadView(childPath)
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = routes
  }
}

const actions = {
  generateRoutes: function({ commit }, data) {
    return new Promise(resolve => {
      const accessedRouters = convertRouter(data)
      commit('SET_ROUTES', accessedRouters)
      resolve(accessedRouters)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
