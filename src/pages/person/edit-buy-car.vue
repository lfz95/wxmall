<template>
<div style="height:100%">
  <div class="bg">
      <div class="header">
         <check-icon :value="select_all" @click.native="selectAll">全选</check-icon>
      </div>
      <ul class="list">
          <li v-for="(item,index) in cart_items" :key="item.item_id">
              <div class="check">
                  <check-icon :value.sync="delete_items[index]" @click.native="checkAll"></check-icon>
              </div>
                  <img :src="image_url(item)">
                  <div class="desc">
                      <div class="select" @click="chooseFormat(item)">
                          已选规格：<label v-for="(val,index) in item.variations" :key="'Format'+index">{{'“'+val.value+'”'}}</label>
                          <i class="icon-right-open-big"></i>
                      </div>
                      <number class="num" v-model="item.quantity" :min=1 :initvalue="item.quantity"></number>
                  </div>
          </li>
      </ul>
     
      <popup v-model="showPopup" v-if="copy_product" >
          <div class="format">
                <i class="close icon-cancel-circled-outline" @click="showPopup=false"></i>
                <div class="head">
                    <img :src="copy_product.main_photo">
                    <div class="right-head">
                        <label class="amount">{{'¥'+copy_product.fixed_price}}</label>
                        <p>库存：{{copy_product.stock}}</p>
                        <p>规格：<label v-for="(item,index) in copy_product.variations" :key="'variation'+index">{{'“'+item.value+'”'}}</label></p>
                    </div>
                    
                </div>
                <div class="line"></div>
                <template v-for="(variation,index) in variations" >
                    <p class="title" :key="'variationTitle'+index">{{variation.name}}：</p>
                    <button class="btn" v-for="varValue in getFormatValue(variation)" :key="'variation'+index+varValue" @click="selectFormat(variation.name,varValue)" :class="{'active':setClass(variation.name,varValue)}" >{{varValue}}</button>
                    <div class="line" :key="'variationLine'+index"></div>
                </template>
          </div>
          <button class="ok-btn" @click="chooseOk">确认</button>
      </popup>
  </div>
   <div class="footer">
            <button class="btn del" @click="deleteProductCar">删除</button>
            <button class="btn" @click="editProductCar">完成</button>
      </div>
</div>
</template>
<script>
import  CheckIcon  from 'vux-components/check-icon'
import Popup from 'vux/src/components/popup'
import Number from '@/components/number'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
   components:{
       CheckIcon,
       Number,
       Popup
   },
   data(){
       return {
            showPopup:false,
            cart_items:[],          //购物车列表
            delete_items:[],        //标识是否删除列表
            select_all:false,       //是否全选
            select_product:null,    //已选中要修改的商品
            copy_product:null,      //已选中要修改的商品副本
            variations:[],          //商品规格列表
       }
   },
   created(){
       this.$vux.loading.show({
           text:'加载中'
       });
       //获取购物车列表
       Http.get('/cart/list/').then(res=>{
           this.$vux.loading.hide();
           if(res.msg){
               this.$vux.toast.text(res.msg);
           }else{
               this.cart_items=res.data.cart_items;
               this.delete_items=new Array(this.cart_items.length).fill(false);
           }
       });
   },
   methods:{
       //全选
       selectAll:function(){
           this.select_all=!this.select_all;
           if(this.select_all){
               this.delete_items.fill(true);
           }else{
               this.delete_items.fill(false);
           }
       },
       //检测当前列表是否全选
       checkAll:function(){
           this.select_all=!this.delete_items.includes(false);
       },
       //规格选择完成
       chooseOk:function(){
           this.select_product.variations=this.copy_product.variations;
           this.showPopup=false;
           console.log(this.select_product);
       },
       //选择商品规格
       chooseFormat:function(item){
           this.select_product=item;
           this.copy_product=JSON.parse(JSON.stringify(this.select_product));
           console.log(this.select_product);
           this.getFormatList();
       },
       //获取规格数据
       getFormatList:function(){
          if(this.variations.length==0){
             Http.get('/product/variation/',{item_id:this.copy_product.item_id}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.showPopup=true;
                    this.variations=res.data.variations;
                }
            })
          }else{
              this.showPopup=true;
          }
       },
       //规格值分解逗号，返回数组
      getFormatValue:function(item){
          if(item.value){
              return item.value.split(',').filter(item=>item!='');
          }else{
              return [];
          }
      },
      //选中规格值
      selectFormat:function(name,val){
          this.copy_product.variations.map(item=>{
              if(item.name==name){
                  item.value=val;
              }
          });
      },
      //设置选中样式
      setClass:function(name,val){
          let flag=false;
          this.copy_product.variations.map(item=>{
              if(item.name==name&&item.value==val){
                  flag= true;
              }
          });
          return flag;
      },
      //删除购物车
      deleteProductCar:function(){
          let data_post=[];
          for(let i=0,len=this.delete_items.length;i<len;i++){
              if(this.delete_items[i]){
                  data_post.push({cart_item_id:this.cart_items[i].cart_item_id});
              }
          }
        //   console.log(data_post);
          if(data_post.length==0){
              this.$vux.toast.text('请选择商品');
              return ;
          }
          this.$vux.loading.show({
                text: '加载中'
            });
          Http.post('/cart/remove/',{cart_items:data_post}).then(res=>{
              this.$vux.loading.hide();
              if(res.msg){
                  this.$vux.toast.text(res.msg);
              }else{
                //   this.$router.push('/buy-car');
                window.history.back();
              }
          })
      },
      //修改购物车
      editProductCar:function(){
          console.log(this.cart_items);
            this.$vux.loading.show({
                text: '加载中'
            });
          Http.post('/cart/',{cart_items:this.cart_items}).then(res=>{
              this.$vux.loading.hide();
              if(res.msg){
                  this.$vux.toast.text(res.msg);
              }else{
                //   this.$router.push('/buy-car');
                window.history.back();
              }
          })
      },
      //图片拼接
        image_url:function(item){
            return Config.image_url(item);
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
    float: right;
    margin-right: .213333rem;
    width: 6.72rem;
}
.list .desc .select{
    height: .746667rem;
    width: 6.2rem;
    border: 1px solid #9a9a9a;
    border-radius: .133333rem;
    color: #9a9a9a;
    position: relative;
    font-size: .4rem;
    line-height: .746667rem;
    padding-left: .453333rem;
    padding-right: .36rem;
    box-sizing: border-box;
    margin-top: .186667rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.list .desc .select i{
    position: absolute;
    display: block;
    right: .16rem;
    top: 0;
    z-index: 100;
}
.list .desc .num{
    margin-top: .32rem;
}
.footer{
    position: fixed;
    bottom: 0;
    background-color: #ffffff;
    width: 100%;
    z-index: 200;
}
.footer .btn{
    width: 50%;
    height: 1.333333rem;
    font-size: .56rem;
    color: #ffffff;
    background-color: #f36355;
    border: none;
     float: left 
}
.footer .del{
    background-color: #efb8b1;
}
.format{
    padding-left: .48rem;
    max-height: 10.08rem;
    font-size: .373333rem;
    background-color: #ffffff;
}
.format .close{
    position: absolute;
    right: .04rem;
    top: .16rem;
    font-size: .48rem;
    padding: .08rem .16rem;
}
.format .head{
    padding-top: .64rem;
    margin-bottom: .533333rem;
}
.format .head img{
    width: 2.08rem;
    height: 2.08rem;
    border: 1px solid #646562;
    vertical-align: top;
}
.format .head .right-head{
    display: inline-block;
    line-height: .4rem;
    margin-left: .4rem;
}
.format .head .amount{
    font-size: .48rem;
    color: #dc3e00;
    display: block;
    line-height: .506667rem;
    margin-top: .24rem;
}
.format .head .right-head p{
    margin-top: .24rem;
}
.format .line{
    border-top: 2px solid #d0d0d0;
}
.format .title{
    line-height: .933333rem;
}
.format .btn{
    width: 2.053333rem;
    height: .586667rem;
    border: none;
    border-radius: .106667rem;
    background-color: #dcdcdc;
    font-size: .346667rem;
    margin-right: .293333rem;
    margin-bottom: .373333rem;
}
.format .active{
    background-color: #f36355;
    color: #ffffff;
}
.format .buy{
    padding: .4rem 0;
    /* margin-bottom: 1.36rem; */
}
.format .buy .right{
    float: right;
    margin-right: .506667rem;
}
.ok-btn{
    height: 1.333333rem;
    width: 100%;
    font-size: .506667rem;
    color: #ffffff;
    background-color: #f74f3f;
}
</style>


