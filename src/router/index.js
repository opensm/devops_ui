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
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
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
        path: 'user',
        name: 'user',
        component: () => import('@/views/auth/users'),
        meta: {
          title: '用户',
          icon: 'user',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'passwd',
        component: () => import('@/views/auth/user_passwd'),
        name: '密码修改',
        meta: { title: '修改密码', noCache: true, activeMenu: '/auth/users' },
        hidden: true
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/auth/roles'),
        meta: {
          title: '角色',
          icon: 'people',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'permission',
        name: 'permission',
        component: () => import('@/views/auth/permission'),
        meta: {
          title: '权限',
          icon: 'el-icon-unlock',
          roles: ['admin', 'manager']
        }
      },
      {
        path: 'ldap',
        name: 'ldap',
        component: () => import('@/views/auth/ldap'),
        meta: {
          title: 'LDAP|AD',
          icon: 'el-icon-paperclip',
          roles: ['admin', 'manager']
        }
      }
    ]
  },
  {
    path: '/config',
    component: Layout,
    redirect: '/config/environment',
    name: '配置中心',
    meta: {
      title: '配置中心',
      icon: 'el-icon-s-cooperation',
      roles: ['admin', 'manager', 'project-manager']
    },
    children: [
      {
        path: 'environment',
        name: 'environment',
        component: () => import('@/views/config/environment'),
        meta: {
          title: '环境配置',
          icon: 'el-icon-discount',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'kubernetes',
        name: 'kubernetes',
        component: () => import('@/views/config/kubernetes'),
        meta: {
          title: 'Kubernetes',
          icon: 'el-icon-bangzhu',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'kubernets_edit/:id(\\d+)',
        component: () => import('@/views/config/kubernets_edit'),
        name: '编辑K8s配置',
        meta: {
          title: '编辑K8s配置',
          noCache: true,
          activeMenu: '/config/kubernetes',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'kubernets_create',
        component: () => import('@/views/config/kubernets_create'),
        name: '新增K8s配置',
        meta: {
          title: '新增K8s配置',
          noCache: true,
          activeMenu: '/config/kubernetes',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'sshkey',
        name: 'sshkey',
        component: () => import('@/views/config/sshkey'),
        meta: {
          title: 'SSH密钥',
          icon: 'el-icon-suitcase',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'service_config',
        name: 'service_config',
        component: () => import('@/views/config/service_config'),
        meta: {
          title: '服务配置文件',
          icon: 'el-icon-suitcase-1',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'service_config_edit/:id(\\d+)',
        component: () => import('@/views/config/service_config_edit'),
        name: '编辑服务配置',
        meta: {
          title: '编辑服务配置',
          noCache: true,
          activeMenu: '/config/service_config',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'service_config_create',
        component: () => import('@/views/config/service_config_create'),
        name: '新增服务配置',
        meta: {
          title: '新增服务配置',
          noCache: true,
          activeMenu: '/config/service_config',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/config/service'),
        meta: {
          title: '服务列表',
          icon: 'el-icon-notebook-2',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'environment_variable',
        name: 'environment_variable',
        component: () => import('@/views/config/environment_variable'),
        meta: {
          title: '环境变量',
          icon: 'el-icon-notebook-1',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'service_edit/:id(\\d+)',
        component: () => import('@/views/config/service_edit'),
        name: '编辑服务',
        meta: {
          title: '编辑服务',
          noCache: true,
          activeMenu: '/config/service',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'service_create',
        component: () => import('@/views/config/service_create'),
        name: '新增服务',
        meta: {
          title: '新增服务',
          noCache: true,
          activeMenu: '/config/service',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'service_resource',
        name: 'service_resource',
        component: () => import('@/views/config/service_resource'),
        meta: {
          title: '服务资源',
          icon: 'el-icon-s-platform',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'kubernetes_environment_configuration',
        name: 'kubernetes_environment_configuration',
        component: () => import('@/views/config/kubernetes_environment_configuration'),
        meta: {
          title: '服务K8S环境配置',
          icon: 'el-icon-s-release',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'docker_environment_configuration',
        name: 'docker_environment_configuration',
        component: () => import('@/views/config/docker_environment_configuration'),
        meta: {
          title: '服务docker环境配置',
          icon: 'el-icon-s-management',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'service_environment',
        name: 'service_environment',
        component: () => import('@/views/config/service_environment'),
        meta: {
          title: '服务部署配置',
          icon: 'el-icon-s-flag',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'kubernetes_helm_repo',
        name: 'kubernetes_helm_repo',
        component: () => import('@/views/config/kubernetes_helm_repo'),
        meta: {
          title: 'HELM仓库',
          icon: 'table',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'kubernetes_helm_chart',
        name: 'kubernetes_helm_chart',
        component: () => import('@/views/config/kubernetes_helm_chart'),
        meta: {
          title: 'HELM 模板',
          icon: 'el-icon-s-data',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'product',
        name: 'product',
        component: () => import('@/views/config/product'),
        meta: {
          title: 'Docker制品',
          icon: 'el-icon-menu',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'product_view/:id(\\d+)',
        component: () => import('@/views/config/product_view'),
        name: '查看制品情况',
        meta: {
          title: '查看制品情况',
          noCache: true,
          activeMenu: '/config/product',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'db',
        name: 'db',
        component: () => import('@/views/config/db'),
        meta: {
          title: '数据库配置',
          icon: 'el-icon-files',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'nacos',
        name: 'nacos',
        component: () => import('@/views/config/nacos'),
        meta: {
          title: '配置管理',
          icon: 'el-icon-files',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'project',
        name: 'Project',
        component: () => import('@/views/config/project'),
        meta: {
          title: '项目',
          icon: 'el-icon-pie-chart',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'notice',
        name: 'notice',
        component: () => import('@/views/config/notice'),
        meta: {
          title: '通知',
          icon: 'el-icon-s-comment',
          roles: ['admin', 'manager', 'project-manager']
        }
      },
      {
        path: 'jenkins',
        name: 'jenkins',
        component: () => import('@/views/config/jenkins'),
        meta: {
          title: 'Jenkins',
          icon: 'el-icon-s-comment',
          roles: ['admin', 'manager', 'project-manager']
        }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    meta: {
      title: '工单管理',
      icon: 'el-icon-s-ticket',
      roles: ['admin', 'project-user']
    },
    children: [
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/order/orders'),
        meta: {
          title: '我的工单',
          icon: 'el-icon-user',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'order',
        name: 'order',
        component: () => import('@/views/order/order.vue'),
        meta: {
          title: '发布清单',
          icon: 'el-icon-user',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/order/edit.vue'),
        name: '编辑工单',
        meta: {
          title: '编辑工单',
          noCache: true,
          activeMenu: '/order/order',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/order/detail.vue'),
        name: '工单详情',
        meta: {
          title: '工单详情',
          noCache: true,
          activeMenu: '/order/detail',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
      {
        path: 'apply',
        name: 'ApplyOrder',
        component: () => import('@/views/order/apply'),
        meta: {
          title: '申请工单',
          icon: 'el-icon-circle-plus-outline',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'index',
        name: 'verify',
        component: () => import('@/views/order/verify'),
        meta: {
          title: '工单审核',
          icon: 'el-icon-s-custom',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'jenkins_create',
        name: 'jenkins_create',
        component: () => import('@/views/order/jenkins_order_create'),
        meta: {
          title: '执行Jenkins任务',
          icon: 'el-icon-user',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'jenkins_order',
        name: 'jenkins_order',
        component: () => import('@/views/order/jenkins_order'),
        meta: {
          title: 'Jenkins任务列表',
          icon: 'el-icon-chat-dot-square',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'jenkins_order_detail/:id(\\d+)',
        name: 'jenkins_order_detail',
        component: () => import('@/views/order/jenkins_order_detail'),
        meta: {
          noCache: true,
          activeMenu: '/order/jenkins_order',
          title: 'Jenkins执行日志',
          icon: 'el-icon-postcard',
          roles: ['admin', 'project-user']
        },
        hidden: true
      }
    ]
  },
  {
    path: '/jira',
    component: Layout,
    meta: {
      title: 'Jira管理',
      icon: 'el-icon-alarm-clock',
      roles: ['admin', 'project-approve']
    },
    children: [
      {
        path: 'index',
        name: 'jira',
        component: () => import('@/views/jira/jira'),
        meta: {
          title: 'Jira配置',
          icon: 'el-icon-timer',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'project',
        name: 'Jira项目版本',
        component: () => import('@/views/jira/jira_project.vue'),
        meta: {
          title: 'Jira项目',
          icon: 'el-icon-watch-1',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'version',
        name: 'Jira项目版本',
        component: () => import('@/views/jira/jira_project_version.vue'),
        meta: {
          title: 'jira版本管理',
          icon: 'el-icon-football',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'issue/:id(\\d+)',
        component: () => import('@/views/jira/jira_project_version-issue.vue'),
        name: '工单详情',
        meta: {
          title: '工单详情',
          noCache: true,
          activeMenu: '/order/detail',
          roles: ['admin', 'manager', 'project-manager']
        },
        hidden: true
      },
    ]
  },
  {
    path: '/ldap',
    component: Layout,
    meta: {
      title: 'AD/LDAP管理',
      icon: 'form',
      roles: ['admin', 'project-approve']
    },
    children: [
      {
        path: 'account',
        name: 'account',
        component: () => import('@/views/form/index'),
        meta: {
          title: '账号管理',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'group',
        name: 'group',
        component: () => import('@/views/auth/ldap_group.vue'),
        meta: {
          title: '组织管理',
          icon: 'el-icon-baseball',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'apply',
        name: 'apply',
        component: () => import('@/views/form/index'),
        meta: {
          title: '申请处理',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      }
    ]
  },
  {
    path: '/cmdb',
    component: Layout,
    meta: {
      title: '资产管理',
      icon: 'form',
      roles: ['admin', 'project-approve']
    },
    children: [
      {
        path: 'monitor',
        name: 'monitor',
        component: () => import('@/views/form/index'),
        meta: {
          title: '监控情况',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'init',
        name: 'init',
        component: () => import('@/views/form/index'),
        meta: {
          title: '初始化情况',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'jumpserver',
        name: 'jumpserver',
        component: () => import('@/views/form/index'),
        meta: {
          title: '跳板机',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'cloud',
        name: 'cloud',
        component: () => import('@/views/form/index'),
        meta: {
          title: '云资源',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      },
      {
        path: 'info',
        name: 'info',
        component: () => import('@/views/form/index'),
        meta: {
          title: '综合展示',
          icon: 'form',
          roles: ['admin', 'project-user']
        }
      }
    ]
  }
]

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
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes.concat(asyncRoutes)
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
