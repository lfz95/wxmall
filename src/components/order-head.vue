<template>
  <div class="nav">
      <router-link tag="a" to="/order-list" :class="{active:activeIndex==0}">全部</router-link>
      <router-link tag="a" to="/wait-orders/UNPAY" :class="{active:activeIndex==1}">待付款<badge :text="unpay_mum" v-if="unpay_mum>0"></badge></router-link>
      <router-link tag="a" to="/wait-orders/PAIED" :class="{active:activeIndex==2}">待发货</router-link>
      <router-link tag="a" to="/wait-orders/SHIPPED" :class="{active:activeIndex==3}">待收货</router-link>
      <router-link tag="a" to="/sale-after" :class="{active:activeIndex==4}">售后<badge :text="after_sale_num" v-if="after_sale_num>0"></badge></router-link>
  </div>
</template>
<script>
import Badge  from 'vux-components/badge'
import Http from '@/utils/http'
export default {
   props:{
       activeIndex:{
           required:true,
           type:Number
       }
   },
   data(){
       return {
           unpay_mum:0,             //未付款数量
           after_sale_num:0,        //待处理售后数量
       }
   },
   created(){
       //获取待处理订单数量
       Http.get('/order/pendings/').then(res=>{
            if(res.msg){
                this.$vux.toast.text(res.msg)
            }else{
                this.unpay_mum=res.data.unpay_mum;
                this.after_sale_num=res.data.after_sale_num;
            }
        })
        
   },
   components:{
       Badge
   },
   watch:{
       activeIndex:function(newvalue){
           //获取待处理订单数量
            Http.get('/order/pendings/').then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg)
                }else{
                    this.unpay_mum=res.data.unpay_mum;
                    this.after_sale_num=res.data.after_sale_num;
                }
            })
            
       }
   }
  
}
</script>
<style scoped>
.nav{
    
    background-color: #ffffff;
    font-size: 0;
}
.nav a{
    width: 2rem;
    line-height: 1.226667rem;
    color: #000000;
    display: inline-block;
    font-size: .426667rem;
    text-align: center;
}
.nav .active{
    background-color: #f36355;
    color: #ffffff;
}
</style>


