import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      },
      {
        path: 'character',
        name: 'Character',
        component: () => import('../views/Character.vue')
      },
      {
        path: 'world',
        name: 'World',
        component: () => import('../views/World.vue')
      },
      {
        path: 'plot',
        name: 'Plot',
        component: () => import('../views/Plot.vue')
      },
      {
        path: 'scene',
        name: 'Scene',
        component: () => import('../views/Scene.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router 