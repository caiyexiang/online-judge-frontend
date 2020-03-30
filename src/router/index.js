import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/group/list',
    children: [
      {
        path: 'group/list',
        name: 'Group',
        meta: { title: '班级列表' },
        component: () => import('@/views/group/index'),
      },
      {
        path: 'group/:group/contest/list',
        name: 'ContestList',
        meta: { title: '测验列表' },
        component: () => import('@/views/contest/index'),
      },
      {
        path: 'user/:id',
        name: 'UserHome',
        meta: { title: '个人资料' },
        component: () => import('@/views/user/index'),
      },
      {
        path: 'user/:id/settings',
        name: 'UserSettings',
        meta: { title: '用户设置' },
        component: () => import('@/views/user/settings/index'),
      },
      {
        path: 'user/:id/code-submission',
        name: 'UserCodeSubmission',
        component: () => import('@/views/user/codeSubmission'),
        meta: { title: '用户提交记录' },
      },
      {
        path: 'user/:id/contest-submission',
        name: 'UserContestSubmission',
        component: () => import('@/views/user/contestSubmission'),
        meta: { title: '用户测验成绩' },
      },
    ],
  },
  {
    path: '/code-submission/:id',
    name: 'CodeSubmission',
    meta: { title: '提交记录' },
    component: () => import('@/views/submission/index'),
  },
  {
    path: '/code-fill-submission/:id',
    name: 'CodeFillSubmission',
    meta: { title: '提交记录' },
    component: () => import('@/views/submission/index'),
  },
  {
    path: '/contest/:id',
    name: 'ContestDetail',
    meta: { title: '测验' },
    component: () => import('@/views/contest/detail'),
  },
  {
    path: '*',
    redirect: '/404',
  },
]

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    title: '登录',
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
