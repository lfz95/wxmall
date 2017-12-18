<template>
  <div class="bg">
      <div class="header">
          <img class="login" src="../../assets/images/person_logo.png">
          <div class="desc" v-if="person_info">
              <p>{{person_info.nickname}}<img src="../../assets/images/vip_icon.png"></p>
              <router-link tag="label" to="/address-manage">我的收货地址></router-link>
          </div>
          <div class="bottom-nav">
              <router-link tag="label" to="/collection" class="left"><i class="icon-star-empty"></i>收藏的商品</router-link>
              <router-link tag="label" to="/buy-car" class="right"><img src="../../assets/images/person_shop.png"> 我的购物车</router-link>
          </div>
      </div>
      <div >
          <label class="my-order">我的订单</label>
          <router-link tag="a" to="/order-list" class="all-order">全部订单></router-link>
      </div>
      <div class="nav">
          <router-link tag="div" to="/wait-orders/UNPAY" class="item">
              <div class="icon green">
                  <img src="../../assets/images/no_pay.png">
              </div>
              <label>待付款</label>
          </router-link>
          <router-link tag="div" to="/wait-orders/PAIED"v  class="item">
              <div class="icon red">
                  <img src="../../assets/images/no_send.png">
              </div>
              <label>待发货</label>
          </router-link>
          <router-link tag="div" to="/wait-orders/SHIPPED"  class="item">
              <div class="icon pink">
                  <img src="../../assets/images/no_receive.png">
              </div>
              <label>待收货</label>
          </router-link>
          <router-link tag="div" to="/sale-after"  class="item">
              <div class="icon blue">
                  <img src="../../assets/images/sale_after.png">
              </div>
              <label>售后</label>
          </router-link>
      </div>
      <ul class="group">
          <router-link tag="li" to="/person-info">
              <label>个人资料</label>
              <i class="right icon-right-open-big"></i>
          </router-link>
          <li @click="goCenter">
               <label>会员中心</label>
               <i class="right icon-right-open-big"></i>
          </li>
          <li>
               <label>客服中心</label>
               <span class="right">400-****-9920</span>
          </li>
          <!-- <li>
              <label>关于我们</label>
              <i class="right icon-right-open-big"></i>
          </li> -->
      </ul>
  </div>
</template>
<script>
import Http from '@/utils/http'
import Go from '@/utils/goback'
import Config from '@/utils/config'
export default {
    data(){
        return {
            person_info:null,
            link_path:'',
        }
    },
    created(){
        Go.removeListener();
        Go.goback(true,function(){
            window.history.replaceState(null,null,'#/');
        })
    },
    mounted(){
        //获取用户信息
        Http.get('/security/user/').then(res=>{
            if(res.msg){
                this.$vux.toast.text(res.msg);
            }else{
                this.person_info=res.data;
            }
        });
        sessionStorage.removeItem('product_list');
        sessionStorage.removeItem('invoice_type');
        sessionStorage.removeItem('invoice_title');
        sessionStorage.removeItem('invoice_tax_id');
        sessionStorage.removeItem('select_address');
        this.link_path=Config.person_center_link;
    },
    methods:{
        goCenter:function(){
            window.location.href=this.link_path;
        }
    }
}
</script>
<style scoped>

.header{
    height: 4.346667rem;
    background: url('../../assets/images/person_bg.png') no-repeat center center;
    background-size: 100% 100%;
    position: relative;
}
.header .login{
    width: 1.653333rem;
    height: 1.653333rem;
    margin-top: 1.12rem;
    margin-left: 1.2rem;
}
.header .desc{
    display: inline-block;
    margin-left: .426667rem;
    margin-top: 1.12rem;
    vertical-align: top;
}
.header .desc p{
    font-size: .506667rem;
    line-height: .533333rem;
}
.header .desc p img{
    width: .533333rem;
    height: .48rem;
}
.header .desc label{
    font-size: .426667rem;
    line-height: .453333rem;
    margin-top: .24rem;
    display: inline-block;
}
.header .bottom-nav{
    height: 1.226667rem;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: linear-gradient(to bottom, rgba(238,229,228,0.4), rgba(232,206,202,0.8));
    line-height: 1.226667rem;
}
.header .bottom-nav .left{
    margin-left: 1.12rem;
}
.header .bottom-nav .right{
    float: right;
    margin-right: 1.253333rem;
}
.header .bottom-nav .right img{
    height: .533333rem;
    width: .56rem;
    vertical-align: sub;
}
.my-order{
    line-height: .906667rem;
    margin-left: .48rem;
}
.all-order{
    line-height: .906667rem;
    margin-right: .533333rem;
    float: right;
    text-decoration: underline; 
    opacity: .6;
    color: #000000;
}
.nav{
    height: 2.853333rem;
    background-color: #ffffff;
    padding: 0 .186667rem;
}
.nav .item{
    width: 25%;
    float: left;
    text-align: center;
}
.nav .item label{
    line-height: .426667rem;
    margin-top: .293333rem;
    display: inline-block;
}
.nav .icon{
    width: 1.28rem;
    height: 1.28rem;
    border-radius: 50%;
    margin:0 .6rem;
    margin-top: .48rem;
}
.nav .icon img{
    height: .56rem;
    width: .613333rem;
    display: block;
    padding-left: .346667rem;
    padding-top: .346667rem;
}
.nav .green{
    background-color: #a8dd44;
}
.nav .red{
    background-color: #fe8579;
}
.nav .pink{
    background-color: #fc8faa;
}
.nav .blue{
    background-color: #4cbcc3;
}
.group{
    background-color: #ffffff;
    padding-left: .426667rem;
    margin-top: .346667rem;
}
.group li{
    border-bottom: 1px solid #d0d0d0;
    line-height: 1.333333rem;
}
.group li:last-child{
    border: none;
}
.group li .right{
    float: right;
    margin-right: .48rem;
}
</style>


