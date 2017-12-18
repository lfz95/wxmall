<template>
 <div v-if="order_info">
     <div class="address clearfix" v-if="product_list[0].virtual=='N'">
        <i class="local icon-location-outline"></i>
        <div class="address-content">
            <label>收货人：{{order_info.contact}}</label>
            <label class="tel">{{order_info.phone_no}}</label>
            <p>{{order_info.address}}</p>
        </div>
        <!-- <i class="right icon-right-open-big"></i> -->
     </div>
     <div class="commodity" v-if="product_list">
         <ul class="list">
            <li v-for="product in product_list" :key="product.item_id"> 
                <div class="goods">
                    <img :src="image_url(product)">
                    <div class="desc clearfix">
                        <p class="title">{{product.title}}</p>
                        <p>已选规格：<label v-for="(format,index) in product.variations" :key="'format'+index">{{'“'+format.value+'”'}}</label></p>
                        <label class="amount">{{'¥'+product.fixed_price}}</label>
                        <label class="num">×{{product.quantity}}</label>
                    </div>
                </div>
            </li>
            
            <li>
                <label class="lineheight">发票信息</label>
                <label class="lineheight right">{{invoiceType}}</label>
            </li>
            <li>
                <label  class="lineheight">小计</label>
                <div class="right total">
                    <p>商品金额：{{'¥'+order_info.trans_amt}}</p>
                    <p>运费：{{'¥'+order_info.shipping_cost}}</p>
                    <p>应付总价：<label class="red-total">{{'¥'+totalPay}}</label></p>
                </div>
            </li>
        </ul>
     </div>
 </div> 
</template>
<script>
import Config from '@/utils/config'
export default {
    props:{
        order_info:{
            required:true,
        },
        product_list:{
            required:true,
        }
    },
    computed:{
        invoiceType:function(){
           if(this.order_info.invoice_type==='NONE'){
               return '不开发票';
           }else if(this.order_info.invoice_type==='PERSON'||this.order_info.invoice_type==='COMPANY'){
               return '普通发票'
           }
       },
       totalPay:function(){
           if(this.order_info.payment_amount){
               return this.order_info.payment_amount;
           }else{
               let r=+this.order_info.shipping_cost+(+this.order_info.trans_amt)||0;
               return r;
           }
       }
    },
    methods:{
        //图片拼接
        image_url:function(item){
            return Config.image_url(item);
        }
    }
}
</script>
<style scoped>
.address{
    height: 2.346667rem;
    padding-left: .373333rem;
    background-color: #ffffff;
}
.address i{
    line-height: 2.346667rem;
}
.address .no-address{
    line-height: 2.346667rem;
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
.commodity{
    margin-top: .28rem;
}
.list{
    width: 9.653333rem;
    padding-left: .346667rem;
    background-color: #ffffff;
}
.list li{
    border-bottom: 2px solid #d3d3d3;
    
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
    vertical-align: top;
}
.goods .desc .title{
    width: 7.066667rem;
}
.goods .desc .amount{
    color: #e34000;
    font-size: .48rem;
}
.goods .desc .num{
    float: right;
    margin-right: .346667rem;
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
.list .total{
    margin-top: .346667rem;
    line-height: .64rem;
}
.list .total .red-total{
    color: #e43f10;
    font-size: .453333rem;
}

</style>


