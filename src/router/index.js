import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import Home from '../views/Home.vue'

const routes = [{
    path: '/',
    name: 'Home',
    component: Home,
    children: [{
        path: "",
        name: "PostList",
        component: () => import('../views/PostList.vue'),
      },
      {
        path: "/detailpost/:id",
        name: 'DetailPost',
        component: () => import( /* webpackChunkName: "about" */ '../views/DetailPost.vue')
      },
      {
        path: '/profile/:id',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router