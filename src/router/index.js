import Vue from 'vue'
import Router from 'vue-router'
import setWechatTitle from '../utils/setWechatTitle.js'
import addressRoute from './address.js'
import personRoutes from './person.js'
import commodityRoutes from './commodity.js'
import ordersRoutes from './orders.js'

Vue.use(Router)
const Home=resolve=>{
   require.ensure(['@/pages/home'],()=>{
     resolve(require('@/pages/home'));
   })
}

const ConfirmOrder=resolve=>{
   require.ensure(['@/pages/confirm-order'],()=>{
     resolve(require('@/pages/confirm-order'));
   })
}



const routes = [
  {
    path: '/',
    meta:{
        title:'别克车生活圈'
    },
    component: Home
  },
  {
    path: '/home',
    meta:{
        title:'别克车生活圈'
      },
    component: Home
  },
  
  {
      path: '/confirm-order',
      name: 'confirm-order',
      meta:{
        title:'确认订单'
      },
      component: ConfirmOrder
  },
  ...commodityRoutes,
  ...personRoutes,
  ...addressRoute,
  ...ordersRoutes
]
const router=new Router({
   mode:'hash',
   routes
})
router.beforeEach((to, from, next) => {
    setWechatTitle(to.meta.title);
    next();
});

export default router
