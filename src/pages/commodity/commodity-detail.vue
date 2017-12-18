<template>
<div>
  <div v-if="detail_data&&main_photos.length>0" class="contain">
      
      <swiper :list="main_photos" dots-position="center" :dots-class="'dot'" :aspect-ratio="648/750" :show-desc-mask="false"  loop ></swiper>
      <div class="header">
        <p class="title"><i>{{detail_data.virtual=='Y'?'卡券':'实物'}}</i>{{detail_data.title}}</p>
        <div class="price">
            {{'¥'+detail_data.fixed_price}}<span>{{'¥'+detail_data.original_price}}</span>
            <p>{{shipping}}</p>
            <!-- <a ><img src="../../assets/images/share_icon.png">分享</a> -->
        </div>
      </div>
      <div class="sale">
            <label v-if="detail_data.provide_invoice"><i class="icon-ok-circled2"></i>提供发票</label>
            <label v-if="detail_data.returns_with"><i class="icon-ok-circled2"></i>限时退换货服务</label>
            <label v-if="detail_data.national_unprofor"><i class="icon-ok-circled2"></i>全国联保</label>
      </div>
      <ul class="param">
          <li class="head">
                <label class="left" v-if="detail_data.virtual=='N'">品牌：{{detail_data.brand}}</label>
                <label >库存：{{detail_data.quantity}}</label>
                <label class="right" v-if="detail_data.virtual=='N'">重量：{{detail_data.weight}}g</label>
          </li>
          <li @click="getFormatList">
              <label>请选择规格</label>
              <i class="right icon-right-open-big"></i>
          </li>
          <li @click="getParams">
              <label>查看产品参数</label>
              <i class="right icon-right-open-big"></i>
          </li>
      </ul>
      
      <div class="show">
          <p class="show-tip">--商品展示--</p>
          <img v-for="(item,index) in longphotos" :key="'longphoto'+index" :src="item" style="width:100%"></x-img>
          <p class="show-tip">--已经到底了--</p>
      </div>
      

      <popup v-model="showPopup" @on-show="closeScroll" @on-hide="resetScroll">
          <div class="format">
                <i class="close icon-cancel-circled-outline" @click="showPopup=false"></i>
                <div class="head">
                    <img :src="main_photos[0].img">
                    <div class="right-head">
                        <label class="amount">{{'¥'+detail_data.fixed_price}}</label>
                        <p>库存：{{detail_data.quantity}}</p>
                        <p>规格：{{selectFormatValue}}</p>
                    </div>
                    
                </div>
                <div class="line"></div>
                <template v-for="(variation,index) in variations" >
                    <p class="title" :key="'variationTitle'+index">{{variation.name}}：</p>
                    <button class="btn" v-for="varValue in getFormatValue(variation)" :key="'variation'+index+varValue" @click="selectFormat(variation.name,varValue)" :class="{'active':selectedVariation.get(variation.name)==varValue}" >{{varValue}}</button>
                    <div class="line" :key="'variationLine'+index"></div>
                </template>
               
                <div class="buy">
                    <label>购买数量：</label>
                    <number class="right" :min="1"  v-model="quantity" :max="detail_data.quantity"></number>
                </div>
                
          </div>
          
      </popup>
      <popup v-model="showParam"  @on-show="closeScroll" @on-hide="resetScroll" :height="'71.364%'">
        <div class="all-param">
            <p class="head">
                --商品详情--
                <i class="icon-cancel-circled-outline" @click="showParam=false"></i>
            </p>
            <ul class="list">
                <li v-for="(item,index) in specifics" :key="'specifics'+index">
                    <label class="left">{{item.name}}</label>
                    <label class="content">{{item.value.replace('/,/g',' ')}}</label>
                </li>
            </ul>
        </div>
      </popup>
  </div>
  <div class="footer">
          <div  class="item" @click="collectItem">
              <i :class="{'icon-star-empty':!collected,'icon-star':collected}"></i>
              <label>收藏</label>
          </div>
          <router-link tag="div" to="/buy-car" class="item">
              <img src="../../assets/images/shop_car.png">
              <label>购物车</label>
          </router-link>
          <button class="item org-bg" @click="addBuyCar">加入购物车</button>
          <button class="item red-bg" @click="goNext">立即购买</button>
      </div>
</div>
</template>
<script>

import XImg from 'vux/src/components/x-img'
import {Swiper} from 'vux/src/components/swiper'
import Popup from 'vux/src/components/popup'
import Number from '@/components/number'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
  data(){
      return {
         
        showPopup:false,
        showParam:false,
        detail_data:null,       //商品详情
        variations:[],          //商品规格列表
        selectedVariation:new Map(),        //已选中的规格
        specifics:[],        //商品参数
        quantity:1,         //商品数量
        collected:false,       //商品是否已收藏
        collection_items:[],
        selectFormatValue:'',
      }
  },
  
  components:{
      Popup,
      XImg,
      Swiper,
      Number
  },
   created(){
        this.$vux.loading.show({
            text: '加载中'
        });
        sessionStorage.removeItem('product_list');
        sessionStorage.removeItem('invoice_type');
        sessionStorage.removeItem('invoice_title');
        sessionStorage.removeItem('invoice_tax_id');
        sessionStorage.removeItem('select_address');
        let id= this.$route.params.id;
      Http.get('/product/detail/',{item_id:id}).then(res=>{
          this.$vux.loading.hide();
          if(res.msg){
              this.$vux.toast.text(res.msg);
          }else{
                this.detail_data=res.data;
                this.getCollections();
          }
      });
  },
  mounted(){
      
  },
  computed:{
      //邮费计算
      shipping:function(){
          if(this.detail_data.shipping_type==='FIXED'){
              return '固定运费'+this.detail_data.shipping_fee+'元';
          }else if(this.detail_data.shipping_type==='FREE'){
              return '包邮';
          }else  if(this.detail_data.shipping_type==='FREE_OVER_AMT'){
              return '满'+this.detail_data.shipping_param+'元包邮';
          }
      },
      //获取商品主图数组
      main_photos:function(){
          if(this.detail_data.main_photos){
              let files= this.detail_data.main_photos.split(',').filter(item=>item!='');
              files.map((item,index)=>{
                //   files[index]=Config.image_base_url+this.detail_data.item_id+'/'+item;
                  files[index]={ url: 'javascript:', img: Config.image_base_url+this.detail_data.item_id+'/'+item, title: '' };
              });
            //   console.log(files);
              return files;
          }
      },

      //获取商品长图数组
      longphotos:function(){
          if(this.detail_data.long_photos){
              let photos= this.detail_data.long_photos.split(',').filter(item=>item!='');
              photos.map((item,index)=>photos[index]=Config.image_base_url+this.detail_data.item_id+'/'+item);
              return photos;
          }else{
              return [];
          }
      },
      //商品重量格式(kg ;或者g)
      getWeight:function(){
          if(this.detail_data.weight>100){
              return parseFloat(this.detail_data.weight/1000).toFixed(2)+'kg';
          }else{
              return this.detail_data.weight+'g';
          }
      },
    
  },
  methods:{
      getCollections:function(){
          //当前商品是否已收藏
            if(sessionStorage.getItem('collection_items')&&sessionStorage.getItem('collection_items')!='undefined'){
                    this.collection_items=JSON.parse(sessionStorage.getItem('collection_items'));
                    console.log(this.detail_data.item_id);
                    if(this.collection_items.findIndex(item=>item.item_id==this.detail_data.item_id)!==-1){
                        this.collected=true;
                    }
            }else{
                    //获取收藏列表
                    Http.get('/collection/list/').then(res=>{
                        if(res.msg){
                            this.$vux.toast.text(res.msg);
                        }else{
                            this.collection_items=res.data.collection_items;
                            sessionStorage.setItem('collection_items',JSON.stringify(this.collection_items));
                            if(this.collection_items.findIndex(item=>item.item_id==this.detail_data.item_id)!==-1){
                                this.collected=true;
                            }
                        }
                    });
            }
      },
      //获取已选规格值
      getSelectFormatValue:function(){
          let result='';
          for(let i of this.selectedVariation.values()){
              result+='“'+i+'”';
          }
          this.selectFormatValue= result;
      },
      //关闭页面滚动
      closeScroll(){
          document.body.style.overflowY="hidden";
      },
      //开启页面滚动
      resetScroll(){
          document.body.style.overflowY="auto";
      },
      changeParam(){
          this.showParam=!this.showParam;
      },
      //获取商品参数
      getParams:function(){
          if(this.specifics.length==0){
            Http.get('/product/specifics/',{item_id:this.detail_data.item_id}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.showParam=true;
                    this.specifics=res.data.specifics;
                }
            })
          }else{
              this.showParam=true;
          }
      },
      //获取规格数据
      getFormatList:function(){
          if(this.variations.length==0){
             Http.get('/product/variation/',{item_id:this.detail_data.item_id}).then(res=>{
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
      //选择规格值
      selectFormat:function(index,val){
          this.selectedVariation.set(index,val);
          this.getSelectFormatValue();
          this.showPopup=false;
          this.showPopup=true;
      },
      //添加到购物车
      addBuyCar:function(){
          if(this.detail_data.virtual=='Y'){
              this.$vux.toast.text('虚拟商品不能添加购物车');
              return ;
          }
          //若库存为0，不让添加购物车
          if(this.detail_data.quantity==0){
              this.$vux.toast.text('当前库存不足');
              return ;
          }
          //判断是否选择过规格
          if(!this.showPopup&&this.selectedVariation.size==0){
              this.getFormatList();
              return ;
          }
          //判断规格是否有遗漏
          if(this.selectedVariation.size<this.variations.length){
              this.showPopup=true;
              this.$vux.toast.text('请选择商品规格');
              return ;
          }
          let selected_data=[];
          //构造已选规格的数组
          for(let item of this.variations){
              console.log(item);
              if(this.selectedVariation.has(item.name)){
                  selected_data.push({name:item.name,value:this.selectedVariation.get(item.name)});
              }
          }
          let post_data={item_id:this.detail_data.item_id,variations:selected_data,quantity:this.quantity};
          this.showPopup=false;
          this.showParam=false;
          //显示加载弹框
          this.$vux.loading.show({
            text: '加载中'
            });
            //发送购车添加请求
          Http.post('/cart/',post_data).then(res=>{
              this.$vux.loading.hide();
              if(res.msg){
                  this.$vux.toast.text(res.msg);
              }else{
                  if(res.data.cart_item_id){
                      this.$vux.toast.show({type: 'success',text:'添加成功'});
                  }
              }
          })
      },
      collectItem:function(){
          if(!this.collected){
            this.$vux.loading.show({
                text: '加载中'
            });
            //提交收藏商品请求
            Http.post('/collection/',{item_id:this.detail_data.item_id}).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                        this.$vux.toast.show({type: 'success',text:'收藏成功'});
                        this.collected=true;
                        this.collection_items.push({collection_item_id:res.data.collection_item_id,...this.detail_data});
                        sessionStorage.setItem('collection_items',JSON.stringify(this.collection_items));
                }
            })
          }else{
              this.$vux.loading.show({
                text: '加载中'
              });
              let del_index=this.collection_items.findIndex(item=>item.item_id==this.detail_data.item_id);
            //   this.$vux.toast.text(this.collection_items[del_index].collection_item_id);
              if(del_index!==-1){
                    //取消该商品的收藏
                    Http.post('/collection/remove/',{collection_item_id:this.collection_items[del_index].collection_item_id}).then(res=>{
                        this.$vux.loading.hide();
                        if(res.msg){
                            this.$vux.toast.text(res.msg);
                        }else{
                                this.$vux.toast.show({type: 'success',text:'取消成功'});
                                this.collected=false;
                                
                                if(del_index!==-1){
                                    this.collection_items.splice(del_index,1);
                                }
                                sessionStorage.setItem('collection_items',JSON.stringify(this.collection_items));
                        }
                    })
              }
              
          }
      },
      //立即购买
      goNext:function(){
          //若库存为0，不让购买
          if(this.detail_data.quantity==0){
              this.$vux.toast.text('当前库存不足');
              return ;
          }
          if(!this.showPopup&&this.selectedVariation.size==0){
              this.getFormatList();
              return ;
          }
          //判断规格是否有遗漏
          if(this.selectedVariation.size<this.variations.length){
              this.showPopup=true;
              this.$vux.toast.text('请选择商品规格');
              return ;
          }
          let productList=[];
          let data=JSON.parse(JSON.stringify(this.detail_data));
          data.quantity=this.quantity;
          data.main_photo=this.detail_data.main_photos.split(',').filter(item=>item!='')[0];
          //获取已选的规格列表
          data.variations=[];
          for(let [key, value] of this.selectedVariation.entries()){
              data.variations.push({name:key,value:value});
          }
          productList.push(data);
          sessionStorage.setItem('product_list',JSON.stringify(productList));
          this.$router.push('/confirm-order');
      }
  }
}
</script>
<style scoped>
.contain{
    height: 100%;
    overflow-y: auto;
}
.header{
    width: 9.493333rem;
    margin-top: .346667rem;
    margin-bottom: .32rem;
    margin-left: auto;
    margin-right: auto;
}
.header .title{
    font-size: .4rem;
    font-weight: 600;
}
.header .title i{
    width: .56rem;
    height: .32rem;
    display: inline-block;
    border-radius: .053333rem;
    font-style: normal;
    font-size: .266667rem;
    line-height: .32rem;
    vertical-align: middle;
    color: #ffffff;
    background-color: #7f007f;
}
.header .price{
    margin-top: .293333rem;
    font-size: .48rem;
    font-weight: 600;
    color: #de4500;
    position: relative;
}
.header .price span{
    font-size: .32rem;
    color: #5a5a5a;
    text-decoration: line-through;
    margin-left: .32rem;
    display: inline-block;
    line-height: .32rem;
}
.header .price p{
    font-size: .32rem;
    color: #000000;
    line-height: .346667rem;
    margin-top: .266667rem;
    font-weight: normal;
}
.header .price a{
    font-size: .373333rem;
    position: absolute;
    right: 0;
    bottom: 0;
    color: #717171;
    line-height: .4rem;
    font-weight: normal;
}
.header .price a img{
    width: .4rem;
    height: .4rem;
    margin-right: .133333rem;
    vertical-align: bottom;
}
.sale{
    height: .72rem;
    background-color: #ededed;
    line-height: .72rem;
    font-size: .32rem;
}
.sale label{
    margin-left: .533333rem;
}
.sale label i{
    color: #de3f1c;
    margin-right: .16rem;
    font-size: .373333rem;
}
.param{
    font-size: .373333rem;
    line-height: .986667rem;
    margin-left: .32rem;
}
.param li{
    border-bottom: 1px solid #d1d1d1;
     position: relative;
}
.param li:last-child{
    border: none;
}
.param  .head{
    text-align: center;
}
.param  .head .left{
    position: absolute;
    left: 0;
    top: 0;
}
.param   .right{
    position: absolute;
    right: .266667rem;
    top: 0;
}
.show{
    margin-bottom: 1.333333rem;
    font-size: .32rem;
}
.show .show-tip{
    background-color: #ededed;
    line-height: .56rem;
    text-align: center;
    color: #818181;
}
.footer{
    position: fixed;
    bottom: 0;
     height: 1.333333rem; 
     width: 100%;
     border-top: 1px solid #b6b6b6;
     z-index: 600;
    /* font-size: 0; */
}
.footer .item{
    /* display: inline-block; */
    float: left;
    font-size: .293333rem;
    width: 1.68rem;
    height: 100%;
    text-align: center;
    border: none;
    background-color: #ffffff;
}
.footer .item i,.footer .item img{
    display: block;
    font-size: .453333rem;
    line-height: .48rem;
    width: .426667rem;
    height: .426667rem;
    margin: 0 auto;
    margin-top: .32rem;
}
.footer .item .icon-star-empty{
    opacity: 0.7;
}
.footer .item .icon-star{
    color: #f36355;
    opacity: 1;
}
.footer .item .icon-star+label{
    color: #f36355;
}
.footer .item label{
    font-size: .293333rem;
    display: inline-block;
    line-height: .4rem;
}
.footer .red-bg{
    background-color: #f36355;
    color: #ffffff;
    font-size: .4rem;
    width: 3.333333rem;
    line-height: 1.333333rem;
}
.footer .org-bg{
    background-color: #fe8c02;
    color: #ffffff;
    font-size: .4rem;
    width: 3.306667rem;
    line-height: 1.333333rem;
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
    min-width: 2.053333rem;
    height: .586667rem;
    padding: 0 .053333rem;
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
    margin-bottom: 1.36rem;
}
.format .buy .right{
    float: right;
    margin-right: .506667rem;
}
.all-param{
    background-color: #ffffff;
    min-height: 100%;
    width: 100%;
}
.all-param .head{
    font-size: .346667rem;
    background-color: #ededed;
    text-align: center;
    line-height: .56rem;
    opacity: 0.7;
}
.all-param .head i{
    float: right;
    margin-right: .4rem;
    opacity: 1;
    font-size: .48rem;
}
.all-param .list{
    width: 100%;
    font-size: .4rem;
}
.all-param .list li{
    margin-left: .426667rem;
    line-height: 1.2rem;
    border-bottom: 2px solid #e6e6e6;
    position: relative;
}
.all-param .list .left{
    opacity: 0.7;
    position: absolute;
    left: 0;
    top: 0;
    width: 2.666667rem;
    white-space: nowrap;
    overflow-x: hidden;
    text-overflow: ellipsis;
}
.all-param .list .content{
    margin-left: 2.906667rem;
}
</style>


