import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: '首页',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/users',
    name: 'auth',
    meta: {
      title: '权限中心',
      icon: 'lock',
      roles: ['admin', 'manager']
    },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/auth/users'),
        meta: {
          title: '用户',
          icon: 'user',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: {
          title: '角色',
          icon: 'people',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/tree/index'),
        meta: {
          title: '权限',
          icon: 'tree',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'ldap',
        name: 'ldap',
        component: () => import('@/views/auth/ldap'),
        meta: {
          title: 'LDAP|AD',
          icon: 'tree',
          roles: ['admin', 'manager']
        }
      }
    ]
  },
  {
    path: '/kubernetes',
    component: Layout,
    redirect: '/kubernetes/kubernetes',
    name: 'Kubernetes',
    roles: ['admin', 'manager'],
    meta: {
      title: 'Kubernetes',
      icon: 'el-icon-s-help',
      roles: ['admin', 'manager']
    },
    children: [
      {
        path: 'kubernetes',
        name: 'Kubernetes',
        component: () => import('@/views/kubernetes/auth'),
        meta: {
          title: 'Kubernetes',
          icon: 'tree',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'namespace',
        name: 'Namespace',
        component: () => import('@/views/kubernetes/namespace'),
        meta: {
          title: '命名空间',
          icon: 'table',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'template',
        name: 'Template',
        component: () => import('@/views/table/index'),
        meta: {
          title: '模板',
          icon: 'table',
          roles: ['admin', 'manager']
        }
      }
    ]
  },
  {
    path: '/verify',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'verify',
        component: () => import('@/views/form/index'),
        meta: { title: '工单审核', icon: 'form' }
      }
    ]
  },
  {
    path: '/db',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'db',
        component: () => import('@/views/form/index'),
        meta: {
          title: '数据库',
          icon: 'form',
          roles: ['admin', 'manager']
        }
      }
    ]
  },
  {
    path: '/apply',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'ApplyOrder',
        component: () => import('@/views/form/index'),
        meta: { title: '申请工单', icon: 'form' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'order',
        component: () => import('@/views/form/index'),
        meta: { title: '我的工单', icon: 'form' }
      }
    ]
  },
  {
    path: '/exit',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'exit',
        component: () => import('@/views/form/index'),
        meta: { title: '退出', icon: 'form' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
