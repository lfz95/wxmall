const BuyCar=resolve=>{
   require.ensure(['@/pages/person/buy-car'],()=>{
     resolve(require('@/pages/person/buy-car'));
   })
}
const EditBuyCar=resolve=>{
   require.ensure(['@/pages/person/edit-buy-car'],()=>{
     resolve(require('@/pages/person/edit-buy-car'));
   })
}
const Collection=resolve=>{
   require.ensure(['@/pages/person/collection'],()=>{
     resolve(require('@/pages/person/collection'));
   })
}
const PersonInfo=resolve=>{
   require.ensure(['@/pages/person/person-info'],()=>{
     resolve(require('@/pages/person/person-info'));
   })
}
const PersonCenter=resolve=>{
   require.ensure(['@/pages/person/person-center'],()=>{
     resolve(require('@/pages/person/person-center'));
   })
}
const Register=resolve=>{
   require.ensure(['@/pages/person/register'],()=>{
     resolve(require('@/pages/person/register'));
   })
}
const personRoutes=[
    {
      path: '/buy-car',
      name: 'buy-car',
      meta:{
        title:'我的购物车'
      },
      component: BuyCar
  },
  {
      path: '/collection',
      name: 'collection',
      meta:{
        title:'我的收藏'
      },
      component: Collection
  },
  {
      path: '/edit-buy-car',
      name: 'edit-buy-car',
      meta:{
        title:'我的购物车'
      },
      component: EditBuyCar
  },
  {
      path: '/person-center',
      name: 'person-center',
      meta:{
        title:'个人中心'
      },
      component: PersonCenter
  },
  {
      path: '/person-info',
      name: 'person-info',
      meta:{
        title:'个人资料'
      },
      component: PersonInfo
  },
  {
      path: '/register',
      name: 'register',
      meta:{
        title:'注册'
      },
      component: Register
  }
]
export default personRoutes;