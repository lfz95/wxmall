const AllCommodity=resolve=>{
   require.ensure(['@/pages/commodity/all-commodity'],()=>{
     resolve(require('@/pages/commodity/all-commodity'));
   })
}
const CommodityDetail=resolve=>{
   require.ensure(['@/pages/commodity/commodity-detail'],()=>{
     resolve(require('@/pages/commodity/commodity-detail'));
   })
}
const Invoice=resolve=>{
   require.ensure(['@/pages/commodity/invoice'],()=>{
     resolve(require('@/pages/commodity/invoice'));
   })
}
const InvoiceHistory=resolve=>{
   require.ensure(['@/pages/commodity/invoice-history'],()=>{
     resolve(require('@/pages/commodity/invoice-history'));
   })
}
const Classify=resolve=>{
   require.ensure(['@/pages/commodity/classify'],()=>{
     resolve(require('@/pages/commodity/classify'));
   })
}
const commodityRoutes=[
    {
      path: '/all-commodity',
      name: 'all-commodity',
      meta:{
        title:'全部商品'
      },
      component: AllCommodity
  },
  {
      path: '/commodity-detail/:id',
      name: 'commodity-detail',
      meta:{
        title:'商品详情'
      },
      component: CommodityDetail
  },
  {
      path: '/invoice',
      name: 'invoice',
      meta:{
        title:'发票'
      },
      component: Invoice
  },
  {
      path: '/invoice-history',
      name: 'invoice-history',
      meta:{
        title:'发票历史'
      },
      component: InvoiceHistory
  },
  {
      path: '/classify',
      name: 'classify',
      meta:{
        title:'微商城'
      },
      component: Classify
  },
]
export default commodityRoutes;