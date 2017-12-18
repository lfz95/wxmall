<template>
<div class="bg">
  <div class="header clearfix" :style="{backgroundColor:top_color}">
      <img :src="logoUrl(logo_photo)">
      <div class="search">
          <input type="search" placeholder="搜索商城商品" v-model="search" @keyup.enter="searchName">
          <i class="icon-search" @click="searchName"></i>
      </div>
  </div>
   <banner :bannerlist="carousel_photos"></banner> 
  <div class="nav"> 
    <router-link tag="div" to="/all-commodity" class="inline"> 
        <div class="circle green">
          <img src="../assets/images/goods_icon.png">
        </div>
         <p>全部商品</p>
    </router-link>
    <router-link tag="div" to="/classify" class="inline">
        <div class="circle red">
          <img src="../assets/images/classify_icon.png">
        </div>
         <p>分类</p>
    </router-link>
    <router-link tag="div" to="buy-car" class="inline">
        <div class="circle pink">
          <img src="../assets/images/shopping_icon.png">
        </div>
         <p>购物车</p>
    </router-link>
    <router-link tag="div" to="/person-center" class="inline">
        <div class="circle blue">
          <img src="../assets/images/user_icon.png">
        </div>
        <p>个人中心</p>
    </router-link>
    
  </div>
  <p class="hot-title">掌柜热卖</p>
  <goods-list :list="item_list" v-if="item_list"></goods-list>
   
</div>
</template>
<script>
import Banner from '../components/banner'
import GoodsList from '@/components/goods-list'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
  data(){
    return {
      top_color:'',
      carousel_photos:[],
      item_list:[],
      logo_photo:'',
      load_carousel:false,
      load_hot_sale:false,
      search:''
    }
  },
  components:{
    Banner,
    GoodsList
  },
  created(){
    sessionStorage.clear();
    this.$vux.loading.show({
      text: '加载中'
    });
    Http.get('/main/carousel/').then(res=>{
         if(res.msg){
             this.$vux.loading.hide();
             this.$vux.toast.text(res.msg);
             
         }else{
            this.top_color=res.data.top_color||'#f36355';
            this.logo_photo=res.data.logo_photo;
            this.carousel_photos=res.data.carousel_photos.split(',').filter(item=>item!=='');
            this.load_carousel=true;
            sessionStorage.setItem('top_color',this.top_color);
            this.closeLoading();
         }
    });
    Http.get('/main/hot-sale/').then(res=>{
         if(res.msg){
             this.$vux.loading.hide();
             this.$vux.toast.text(res.msg);
         }else{
            this.item_list=res.data.item_list;
            this.load_hot_sale=true;
            this.closeLoading();
         }
    });
  },
  mounted(){
    
    //获取收藏列表
    Http.get('/collection/list/').then(res=>{
        if(res.msg){
            this.$vux.toast.text(res.msg);
        }else{
            let colls=res.data.collection_items;
            sessionStorage.setItem('collection_items',JSON.stringify(colls));
        }
    });
  },
  methods:{
      closeLoading:function(){
          if(this.load_carousel&&this.load_hot_sale){
              this.$vux.loading.hide();
          }
      },
      searchName:function(){
            // sessionStorage.setItem('search_name',this.search);
           this.$router.push({ path: '/all-commodity' ,query:{search_name:this.search}});
       },
       //logo图片路径
      logoUrl:function(item){
        return  Config.bannerImgUrl(item);
      }
  },
}
</script>
<style scoped>
.bg{
  background-color: #ececec;
  font-size: .4rem;
  height: 100%;
  -webkit-overflow-scrolling: touch
}
.header{
  height: 1.066667rem;
  /* background-color: #f36355; */
}
.header img{
  width: .986667rem;
  height: .986667rem;
  line-height: 1.066667rem;
  margin-left: .4rem;
  margin-top: .03rem;
}
.header .search{
  float: right;
  margin-right: .373333rem;
  height: 1.066667rem;
  position: relative;
  color: #898989;
}
.header .search input{
  width: 5.68rem;
  height: .746667rem;
  font-size: .4rem;
  padding-left: .933333rem;
  border-radius: .346667rem;
  margin-top: .186667rem;
}
.header .search i{
  position: absolute;
  left: .373333rem;
  font-size: .4rem;
  top: .213333rem;
}
.nav{
  background-color: #ffffff;
  height: 2.773333rem;
}
.nav .inline{
  display: inline-block;
  text-align: center;
  width: 2.4rem;
}
.nav .inline p{
  margin-top: .213333rem;
  line-height: .426667rem;
}
.nav .circle{
  height: 1.386667rem;
  width: 1.386667rem;
  border-radius: 50%;
   margin-top: .373333rem;
  margin-left: auto;
  margin-right: auto;
}
.nav .circle img{
  width: .666667rem;
  height: .666667rem;
  margin: .373333rem;
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
.hot-title{
  font-size: .453333rem;
  color: #f36355;
  position: relative;
  margin-left: .666667rem;
  margin-top: .4rem;
  margin-bottom: .4rem;
  font-weight: 600;
}
.hot-title::before{
  position: absolute;
  left: -.48rem;
  content: '';
  width: .16rem;
  height: .64rem;
  background-color: #f36355;
}

</style>


