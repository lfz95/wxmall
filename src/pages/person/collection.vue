<template>
  <div>
    <swipeout v-if="collection_items.length>0"> 
      <ul class="list">
          <li v-for="(item,index) in collection_items" :key="item.item_id" @click="goDetail(item.item_id)">
               <swipeout-item :transition-mode="'follow'" >
                  <div slot="content" class="item">
                    <img :src="image_url(item)">
                    <div class="desc">
                        <p>{{item.title}}</p>
                        <label class="sale-amount">{{'¥'+item.fixed_price}}</label>
                        <label class="format old-amount">{{'¥'+item.original_price}}</label>
                    </div>
                  </div>
                  <div slot="right-menu">
                    <!-- <swipeout-button  background-color="#eda609" :width="buttonWidth"  style="font-size:.4rem" @click="addBuyCar(item)">加入购物车</swipeout-button> -->
                    <swipeout-button background-color="#f36355"  :width="buttonWidth" style="width:2.133333rem;font-size:.4rem" @click.native.stop="deletePost(index,item)">删除</swipeout-button>
                 </div>
              </swipeout-item> 
          </li>
          
      </ul>
    </swipeout> 
    <div class="no-collected" v-if="collection_items.length==0">
        <img src="../../assets/images/no_collected.png">
        <p>收藏夹空空如也，赶紧去逛逛~</p>
        <router-link tag="button" to="/all-commodity" replace="">去逛逛</router-link>
    </div>
  </div>
</template>
<script>
import { Swipeout, SwipeoutItem, SwipeoutButton } from 'vux-components/swipeout'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
   components:{
    //    SliderDelete,
       Swipeout,
       SwipeoutItem,
       SwipeoutButton
   },
   computed:{
       //左滑删除按钮的宽度，rem转px
       buttonWidth:function(){
           let baseSize=document.documentElement.style.fontSize.replace('px','');
           return Math.round(+baseSize*2.133333);
       }
   },
   data(){  
        return {  
            sliderConf:{//滑动配置  
                distance:1.4,  
            },
            collection_items:[],
            delete_items:[]
        }  
    },
    created(){
        this.$vux.loading.show({
        text: '加载中'
        });
    },
    mounted(){
       this.getCollections();
        
    },
    methods:{
         //获取收藏列表
        getCollections:function(){
            Http.get('/collection/list/').then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.collection_items=res.data.collection_items;
                }
            });
        },
        //删除收藏商品
        deletePost:function(idx,item){
            this.$vux.loading.show({
                text: '加载中'
            });
            Http.post('/collection/remove/',{collection_item_id:item.collection_item_id}).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    
                    this.$vux.toast.show({type: 'success',text:'删除成功'});
                    this.getCollections();
                }
            })
        },
        //查看商品详情
        goDetail:function(id){
            this.$router.push('/commodity-detail/'+id);
        },
        //图片拼接
       image_url:function(item){
            return Config.image_base_url+item.item_id+'/'+item.main_photo;
        }
    }
}
</script>
<style scoped>
.list{
    background-color: #ffffff;
    padding-left: .346667rem;
    font-size: .4rem;
    line-height: .426667rem;
}
.list li{
    border-bottom: 1px solid #d2d2d2;
    position: relative;
    height: 2.8rem;
}
.list li:last-child{
    border: none;
}
.list li .item{
    padding-top: .4rem;
}
.list li img{
    width: 1.973333rem;
    height: 1.973333rem;
    border: 2px solid #626262;
}
.list .desc{
    margin-left: .24rem;
    width: 7.066667rem;
    display: inline-block;
    vertical-align: super
}

.list .desc .sale-amount{
    font-size: .453333rem;
    color: #e44200;
    margin-top: .28rem;
    display: inline-block;
    line-height: .48rem;
    font-weight: 600;
}
.list .desc .old-amount{
    text-decoration: line-through;
    font-size: .373333rem;
    line-height: .4rem;
    opacity: 0.7;
    margin-left: .426667rem;
}
.no-collected{
    font-size: .453333rem;
    text-align: center;
    line-height: .48rem;
}
.no-collected img{
    height: 2rem;
    width: 2.346667rem;
    margin-top: 3.013333rem;
}
.no-collected p{
    margin-top: 1.12rem;
}
.no-collected button{
    margin-top: 1.893333rem;
    width: 6.906667rem;
    height: 1.12rem;
    background-color: #f36355;
    color: #ffffff;
    font-size: .56rem;
    border: none;
}
</style>
