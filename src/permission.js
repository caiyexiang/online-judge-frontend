import router from './router'
import { asyncRoutes } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUserid } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  const userid = getUserid()

  if (userid) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // 用户状态是否存在于vuex
      const hasUserState = Boolean(store.getters.username)
      if (hasUserState) {
        next()
      } else {
        // vuex不存在用户状态，就是刚登录或者重启浏览器
        try {
          // 拉取userInfo
          await store.dispatch('user/getInfo')
          // 动态添加
          router.addRoutes(asyncRoutes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove login flag and go to login page to re-login
          // 这一步只是保持完整性，因为在无cookie的情况下访问api，会先一步被清除用户信息和重定位到登录页
          await store.dispatch('user/resetInfo')
          console.error(error)
          next(`/login`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
