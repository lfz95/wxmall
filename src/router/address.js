const AddressSelect=resolve=>{
   require.ensure(['@/pages/address/address-select'],()=>{
     resolve(require('@/pages/address/address-select'));
   })
}
const AddressManage=resolve=>{
   require.ensure(['@/pages/address/address-manage'],()=>{
     resolve(require('@/pages/address/address-manage'));
   })
}
const AddressAdd=resolve=>{
   require.ensure(['@/pages/address/address-add'],()=>{
     resolve(require('@/pages/address/address-add'));
   })
}
const addressRoute=[
  {
      path: '/address-select',
      name: 'address-select',
      meta:{
        title:'选择收货地址'
      },
      component: AddressSelect
  },
  {
      path: '/address-manage',
      name: 'address-manage',
      meta:{
        title:'地址管理'
      },
      component: AddressManage
  },
  {
      path: '/address-add',
      name: 'address-add',
      meta:{
        title:'地址管理'
      },
      component: AddressAdd
  }
];
export default addressRoute;