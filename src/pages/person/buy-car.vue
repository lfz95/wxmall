<template>
<div style="height:100%">
    <div class="bg" v-if="carList.length>0">
      <div class="header">
         <check-icon :value="select_all" @click.native="buyAll">全选</check-icon>
         <router-link tag="span" to="edit-buy-car" class="right">编辑</router-link>
      </div>
      <ul class="list">
          <li v-for="item in carList" :key="item.item_id">
              <div class="check">
                  <check-icon :value.sync="item.selected" @click.native="checkAll"></check-icon>
              </div>
                  <img  :src="image_url(item)">
                  <div class="desc">
                      <p>{{item.title}}</p>
                      <p class="format">已选规格：<label v-for="(val,index) in item.variations" :key="'Format'+index">{{'“'+val.value+'”'}}</label></p>
                      <label class="sale-amount">{{'¥'+item.fixed_price}}</label>
                      <label class="format old-amount">{{'¥'+item.original_price}}</label>
                      <span class="num">{{'×'+item.quantity}}</span>
                  </div>
          </li>
      </ul>
      
  </div>  
    <div class="footer"  v-if="carList.length>0">
        <div class="total">
            <p class="num">共{{total_num}}件商品</p>
            <p class="amount">总计：<span>{{'¥'+total_amount}}</span></p>
        </div>
        <button class="btn" @click="goNext">结算</button>
    </div>
   <div class="null-car" v-if="carList.length==0">
     <img src="../../assets/images/null_car.png">
     <p>购物车空空如也，赶紧去逛逛~</p>
     <router-link tag="button" to="/all-commodity" replace="">去逛逛</router-link>
  </div> 
</div>
</template>
<script>
import  CheckIcon  from 'vux-components/check-icon'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
   components:{
       CheckIcon
   },
   data(){
       return {
           carList:[],
           select_all:false
       }
   },
   created(){
       this.$vux.loading.show({
           text:'加载中'
       });
       sessionStorage.removeItem('product_list');
        sessionStorage.removeItem('invoice_type');
        sessionStorage.removeItem('invoice_title');
        sessionStorage.removeItem('invoice_tax_id');
        sessionStorage.removeItem('select_address');
       //获取购物车列表
       Http.get('/cart/list/').then(res=>{
           this.$vux.loading.hide();
           if(res.msg){
               this.$vux.toast.text(res.msg);
           }else{
               this.carList=res.data.cart_items;
               this.checkAll();
           }
       })
   },
   computed:{
       //已选中商品的总计金额
       total_amount:function(){
           let select_car=this.carList.filter(item=>item.selected==true);
           let amount=0;
           for(let item of select_car){
               amount+=item.fixed_price*item.quantity;
           }
           return parseFloat(amount).toFixed(2);
       },
       //已选中商品的数量
       total_num:function(){
           let select_car=this.carList.filter(item=>item.selected==true);
           let num=0;
           for(let item of select_car){
               num+=+item.quantity;
           }
           return num;
       }
   },
   methods:{
       //购物车全选事件
       buyAll:function(){
           this.select_all=!this.select_all;
           if(this.select_all){
               this.carList.map(item=>item.selected=true);
           }else{
               this.carList.map(item=>item.selected=false);
           }
       },
       //检测当前是否全选
       checkAll:function(){
           let flag=true;
           for(let item of this.carList){
               if(item.selected==false){
                   flag=false;
                   break;
               }
           }
           if(flag){
               this.select_all=true;
           }else{
               this.select_all=false;
           }
       },
       //购物车结算
       goNext:function(){
           let select_car=this.carList.filter(item=>item.selected==true);
           sessionStorage.setItem('product_list',JSON.stringify(select_car));
           this.$router.push('/confirm-order');
       },
       //图片拼接
       image_url:function(item){
        return Config.image_base_url+item.item_id+'/'+item.main_photo;
      }
   }
}
</script>
<style scoped>

.header{
    font-size: .4rem;
    line-height: 1.013333rem;
    padding-left: .16rem;
}
.header .right{
    float: right;
    margin-right: .346667rem;
}
.list{
    background-color: #ffffff;
    padding-left: .746667rem;
    font-size: .4rem;
    line-height: .426667rem;
    margin-bottom: 2.88rem;
}
.list li{
    border-bottom: 1px solid #d2d2d2;
    position: relative;
    padding: .4rem 0;
}
.list li:last-child{
    border: none;
}
.list li img{
    width: 1.973333rem;
    height: 1.973333rem;
    border: 2px solid #626262;
}
.list .check{
    position: absolute;
    left: -.613333rem;
    width: .533333rem;
    height: .533333rem;
    top: 50%;
    margin-top: -.266667rem;
}
.list .desc{
    display: inline-block;
    margin-left: .08rem;
    width: 6.72rem;
}
.list .desc .format{
    opacity: 0.6;
    margin-top: .16rem;
}
.list .desc .sale-amount{
    font-size: .48rem;
    color: #e44200;
    margin-top: .213333rem;
    display: inline-block;
}
.list .desc .old-amount{
    text-decoration: line-through;
}
.list .desc .num{
    float: right;
}
.footer{
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    width: 100%;
    z-index:200;
}
.footer .total{
    float: left;
    width: 69.6%;
    height: 1.786667rem;
}
.footer .total .num{
    opacity: 0.7;
    font-size: .373333rem;
    margin-top: .346667rem;
    margin-left: .48rem;
    line-height: .4rem;
}
.footer .total .amount{
    font-size: .453333rem;
    margin-top: .266667rem;
    margin-left: .48rem;
    line-height: .48rem;
}
.footer .total .amount span{
    font-size: .533333rem;
    color: #e03d0d;
    line-height: .56rem;
}
.footer .btn{
    width: 30.4%;
    height: 1.786667rem;
    font-size: .586667rem;
    color: #ffffff;
    background-color: #f36355;
    border: none;
}
.null-car{
    font-size: .453333rem;
    text-align: center;
    line-height: .48rem;
}
.null-car img{
    height: 2.346667rem;
    width: 2.64rem;
    margin-top: 2.506667rem;
}
.null-car p{
    margin-top: .96rem;
}
.null-car button{
    height: 1.146667rem;
    width: 6.906667rem;
    background-color: #f36355;
    color: #ffffff;
    font-size: .56rem;
    margin-top: 1.546667rem;
    border: none;
}
</style>


