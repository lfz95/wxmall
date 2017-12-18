<template>
 <div class="bg">
     <div class="address clearfix" v-if="product_list[0].virtual=='N'">
         <div  @click="addAddress" v-if="!has_default">
        <i class="local icon-location-outline"></i>
        <label class="no-address" v-if="!has_default">暂无收货地址，请前往新建</label>
        <i class="right icon-right-open-big"></i>
         </div>
        <router-link tag="div" to="/address-select" class="address-content" v-if="has_default">
            <label>收货人：{{has_default.contact}}</label>
            <label class="tel">{{has_default.phone_no}}</label>
            <p>{{has_default.address}}</p>
            
        </router-link>
        <i class="right icon-right-open-big" v-if="has_default"></i>
     </div>
     <div class="border"></div>
     <ul class="list" v-if="product_list">
         <li v-for="product in product_list" :key="product.item_id">
             <div class="goods">
                 <img :src="image_url(product)">
                 <div class="desc clearfix">
                     <p class="title">{{product.title}}</p>
                     <p>已选规格：<label v-for="(format,index) in product.variations" :key="'format'+index">{{'“'+format.value+'”'}}</label></p>
                     <label class="amount">{{'¥'+product.fixed_price}}</label>
                     <label class="num">{{'×'+product.quantity}}</label>
                 </div>
             </div>
         </li>
         <!-- <li class="buy-num" v-if="product_only&&!order_id">
             <label>购买数量</label>
             <number class="right" :min="1" v-model="product_only" :initvalue="product_only"></number>
         </li> -->
         <!-- <li v-if="product_list[0].virtual!='Y'">
             <label class="lineheight">配送方式</label>
             <label class="lineheight right delivery-amount">¥{{shipping_cost}}</label>
         </li> -->
         <router-link tag="li" to="/invoice-history" v-if="product_list[0].virtual!='Y'">
             <label class="lineheight">发票信息</label>
             <label class="lineheight right">{{invoiceType}}<i class="icon-right-open-big"></i></label>
         </router-link>
         <li>
             <label  class="lineheight">小计</label>
             <div class="right total">
                 <p>商品金额：{{'¥'+trans_amt}}</p>
                 <p>运费：{{'¥'+shipping_cost}}</p>
                  <p>应付总价：<label class="red-total">{{'¥'+pay_amount}}</label></p>
             </div>
         </li>
     </ul>
     <button class="pay-btn green" @click="createOrder('WEIXIN')">微信支付</button>
     <button class="pay-btn red" @click="createOrder('MEMBER')">会员卡支付</button>
      <card-pay ref="cardpay" @close-pay="closePay" v-if="showPay"></card-pay> 
 </div> 
</template>
<script>
import Number from '@/components/number'
import CardPay from '@/components/card-pay'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
   components:{
       Number,
       CardPay
   },
   data(){
       return {
           showPay:false,
           order_id:'',
           product_list:[],   //结算商品列表
           addresses:[],        //地址列表
           has_default:null,    //默认收货地址
           invoice_type:'NONE',
           invoice_title:'',
           invoice_tax_id:'',
           invoice_id:'',
           trans_amt:0,             //交易金额
           shipping_cost:0,         //总运费
           pay_amount:0,            //支付金额
           payment_method:'MEMBER',
           product_only:undefined   //商品列表仅有一个时的商品数量
       }
   },
   created(){
        this.$vux.loading.show({
            text: '加载中'
        });
        this.order_id=this.$route.query.orderId;
        if(sessionStorage.getItem('product_list')&&sessionStorage.getItem('product_list')!='undefined'){
            this.product_list=JSON.parse(sessionStorage.getItem('product_list'));
            // console.log(this.product_list);
            if(this.product_list.length==1){
                this.product_only=this.product_list[0].quantity;
            }
            this.calcFee();
        }
        if(sessionStorage.getItem('invoice_type')&&sessionStorage.getItem('invoice_type')!='undefined'){
            this.invoice_type=sessionStorage.getItem('invoice_type');
            this.invoice_title=sessionStorage.getItem('invoice_title');
            this.invoice_tax_id=sessionStorage.getItem('invoice_tax_id')||'';
            this.invoice_id=sessionStorage.getItem('invoice_id');
        }
        //获取收货地址
       if(sessionStorage.getItem('select_address')&&sessionStorage.getItem('select_address')!='undefined'){
           this.has_default=JSON.parse(sessionStorage.getItem('select_address'));
           this.$vux.loading.hide();
       }else{
           Http.get('/address/list/').then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.addresses=res.data.addresses;
                    sessionStorage.setItem('addresses',JSON.stringify(this.addresses));
                    this.has_default=this.addresses.find(item=>item.default_flag==true)||this.addresses[0];
                }
            })
       }
   },
   methods:{
       closePay:function(v){
            this.showPay=false;
            console.log(v)
       },
       //添加地址
        addAddress:function(){
            if(this.addresses.length==0){
                sessionStorage.removeItem('edit_address');
                this.$router.push('/address-add');
            }else{
                this.$router.push('/address-select');
            }
            
        },
        //购物车结算没有运费参数，重新获取参数
        getShipping:function(id){
            Http.get('/product/detail/',{item_id:id}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    // this.detail_data=res.data;
                    this.product_list[0].shipping_type=res.data.shipping_type;
                    this.product_list[0].shipping_param=res.data.shipping_param;
                    this.product_list[0].shipping_fee=res.data.shipping_fee;
                    if(this.product_list[0].shipping_type=='FREE'){
                        this.shipping_cost=0;
                    }else if(this.product_list[0].shipping_type=='FREE_OVER_AMT'){
                        this.shipping_cost=this.trans_amt>=this.product_list[0].shipping_param?0:this.product_list[0].shipping_fee;
                    }else{
                        this.shipping_cost=this.product_list[0].shipping_fee;
                    }
                    this.pay_amount=((+this.trans_amt)+(+this.shipping_cost)).toFixed(2);
                }
            });
        },
        //计算运费
        calcFee:function(){
            //若商品列表仅有一个时,计算运费
            if(this.product_only){
                this.trans_amt=this.product_list[0].fixed_price*this.product_only;
                if(!this.product_list[0].shipping_type){
                    this.getShipping(this.product_list[0].item_id);
                }else{
                    if(this.product_list[0].shipping_type=='FREE'){
                        this.shipping_cost=0;
                    }else if(this.product_list[0].shipping_type=='FREE_OVER_AMT'){
                        this.shipping_cost=this.trans_amt>=this.product_list[0].shipping_param?0:this.product_list[0].shipping_fee;
                    }else{
                        this.shipping_cost=this.product_list[0].shipping_fee;
                    }
                    this.pay_amount=((+this.trans_amt)+(+this.shipping_cost)).toFixed(2);
                }
                
                return ;
            }
            //若商品多于一个，向后台请求运费
            let post_data=[];
            for(let item of this.product_list){
                post_data.push({item_id:item.item_id,quantity:item.quantity})
            }
            Http.post('/order/calc-fee/',{order_items:post_data}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.trans_amt=res.data.trans_amt;
                    this.shipping_cost=res.data.shipping_cost;
                    this.pay_amount=((+this.trans_amt)+(+this.shipping_cost)).toFixed(2);
                }
            });
        },
        //生成订单
        createOrder:function(meathod){
            if(!this.has_default&&this.product_list[0].virtual=='N'){
                this.$vux.toast.text('请选择收货地址');
                return ;
            }
            console.log(this.product_list[0].virtual);
            //若是虚拟商品，收货地址赋值为空
            if(this.product_list[0].virtual=='Y'){
                this.has_default={contact:'',phone_no:'',address:''};
            }
            this.payment_method=meathod;
            //若订单已存在，直接创建支付流水
            if(this.$route.query.orderId){
                this.createOderSn(this.$route.query.orderId);
                return ;
            }
            let post_data={
                ...this.has_default,
                invoice_type:this.invoice_type,
                invoice_title:this.invoice_title,
                invoice_tax_id:this.invoice_tax_id,
                invoice_id:this.invoice_id,
                trans_amt:this.trans_amt,
                shipping_cost:this.shipping_cost,
                order_items:this.product_list
            }
            console.log(post_data);
            this.$vux.loading.show({
                text: '加载中'
            });
            Http.post('/order/create/',post_data).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.$vux.toast.show({type:'success',text:'下单成功'});
                    
                    this.createOderSn(res.data.order_id);
                }
            })
        },
        //生成交易流水
        createOderSn:function(id){
            Http.post('/order/pay/',{order_id:id,payment_method:this.payment_method}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg||'交易流水生成失败');
                }else{
                    // this.$router.replace('/wait-orders/UNPAY');
                    window.location.href=res.data.payment_url;
                }
            })
        },
        //图片拼接
        image_url:function(item){
            return Config.image_url(item);
        }
   },
   computed:{
       invoiceType:function(){
           if(this.invoice_type==='NONE'){
               return '不开发票';
           }else if(this.invoice_type==='PERSON'||this.invoice_type==='COMPANY'){
               return '普通发票'
           }
       },
       //商品的总计金额
       total_amount:function(){
           let amount=0;
           for(let item of this.product_list){
               amount+=item.fixed_price*item.quantity;
           }
           return amount;
       },
   },
   watch:{
       product_only:function(){
           this.calcFee();
           this.product_list[0].quantity=this.product_only;
       }
   },
   beforeRouteLeave:function(to,from,next){
        if(to.path=='/invoice-history'||to.path=='/address-select'||to.path=='/address-add'){
            if(this.order_id){
                next(false)
            }else{
                next();
            }
            
        }else{
            sessionStorage.removeItem('product_list');
            sessionStorage.removeItem('invoice_type');
            sessionStorage.removeItem('invoice_title');
            sessionStorage.removeItem('invoice_tax_id');
            sessionStorage.removeItem('invoice_id');
            sessionStorage.removeItem('select_address');
            next();
        }
    },
    beforeRouteEnter:function(to,from,next){
    //    console.log(from);
       if(to.path=='/confirm-order'&&from.name!='close-order'&&from.name!='buy-car'&&from.name!='commodity-detail'&&from.name!='wait-orders'&&from.name!='address-select'&&from.name!='address-add'&&from.name!='invoice-history'){
           next('/wait-orders/UNPAY');
       }else{
           next();
       }
   }
}
</script>
<style scoped>
.bg{
    background-color: #f5f5f5;
    font-size: .4rem;
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch
}
.address{
    height: 2.346667rem;
    padding-left: .373333rem;
}
.address i{
    line-height: 2.346667rem;
}
.address .no-address{
    line-height: 2.346667rem;
    display: inline-block;
}
.address .local{
    margin-right: .346667rem;
    float: left;
}
.address .right{
    float: right;
    margin-right: .346667rem;
}
.address .address-content{
    display: inline-block;
    width: 8.026667rem;
    margin-top: .533333rem;
    font-size: .373333rem;
}
.address .address-content .tel{
    float: right;
    margin-right: .16rem;
}
.address .address-content p{
    line-height: .426667rem;
}
.address .address-content label{
    line-height: .533333rem;
}
.border{
    background:url('../assets/images/border.png') repeat-x 0 0;
    background-size: 1.6rem .106667rem;
    height: .106667rem;
}
.list{
    width: 9.653333rem;
    padding-left: .346667rem;
    background-color: #ffffff;
}
.list li{
    border-bottom: 1px solid #d3d3d3;
    
}
.list li:last-child{
    border: none;
    height: 2.4rem;
}
.goods{
    padding-top: .4rem;
    margin-bottom: .426667rem;
}
.goods img{
    width: 1.84rem;
    height: 1.84rem;
    border: 2px solid #5e5c5a;
}
.goods .desc{
    display: inline-block;
    margin-left: .4rem;
    line-height: .533333rem;
    vertical-align: bottom;
}
.goods .desc .title{
    width: 7.066667rem;
    height: 1.04rem;
    overflow-y: hidden;
    text-overflow: ellipsis;
}
.goods .desc .amount{
    color: #e34000;
    font-size: .48rem;
}
.goods .desc .num{
    float: right;
    margin-right: .346667rem;
}
.list .buy-num{
    padding: .32rem 0;
}
.list .right{
    float: right;
    margin-right: .346667rem;
    text-align: right;
}
.list .lineheight{
    line-height: 1.333333rem;
}
.list .lineheight i{
    margin-left: .266667rem;
}
.list .delivery-amount{
    color: #d1430e;
}
.list .delivery-desc{
    opacity: 0.7;
}
.list .total{
    margin-top: .346667rem;
    line-height: .64rem;
}
.list .total .red-total{
    color: #e43f10;
    font-size: .453333rem;
}
.pay-btn{
    width: 6.346667rem;
    height: 1.013333rem;
    border: none;
    border-radius: .106667rem;
    display: block;
    margin-left: auto;
    margin-right: auto;
    color: #ffffff;
    font-size: .453333rem;
}
.green{
    background-color: #09a90c;
    margin-top: .933333rem;
}
.red{
    background-color: #e76364;
    margin-top: .32rem;
    margin-bottom: .4rem;
}
</style>


