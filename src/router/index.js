import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { title: '后台登录' }
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import(/* webpackChunkName: "welcome" */ '../views/Welcome.vue'),
        meta: { title: '后台首页' }
      },
      {
        path: '/userlist',
        component: () => import(/* webpackChunkName: "userlist" */ '../views/user/UserList.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/fatherlist',
        component: () => import(/* webpackChunkName: "fatherlist" */ '../views/board/FatherList.vue'),
        meta: { title: '父板块管理' }
      },
      {
        path: '/sonlist',
        component: () => import(/* webpackChunkName: "sonlist" */ '../views/board/SonList.vue'),
        meta: { title: '子板块管理' }
      },
      {
        path: '/managelist',
        component: () => import(/* webpackChunkName: "managelist" */ '../views/manage/ManageList.vue'),
        meta: { title: '管理员管理' }
      },
      {
        path: '/system',
        component: () => import(/* webpackChunkName: "system" */ '../views/system/System.vue'),
        meta: { title: '系统管理' }
      },
      {
        path: '/contentlist',
        component: () => import(/* webpackChunkName: "contentlist" */ '../views/content/ContentList.vue'),
        meta: { title: '帖子管理' }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) { // 判断是否有标题
    document.title = to.meta.title
  }
  next() // 这个一定不能忘了！不然路由不会跳转的！
})

export default router
