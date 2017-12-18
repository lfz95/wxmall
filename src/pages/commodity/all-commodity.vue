<template>
  <div class="bg" id="scrollContain" @scroll="dropHandle">
        <!-- <div class="header clearfix" :style="{backgroundColor:top_color}">
            <div class="search">
                <input type="search" placeholder="搜索商城商品" v-model="title" @keyup.enter="searchName">
                <i class="icon-search" @click="searchName"></i>
            </div>
        </div> -->
      <div class="tab">
            <div class="tab-item" @click="changeOrderBy('DEFAULT')" :class="{'tab-active':order_by=='DEFAULT'}">
                默认排序
            </div>
            <div class="tab-item" @click="changeOrderBy('SALES')" :class="{'tab-active':order_by=='SALES'}">
                人气优先
            </div>
            <div class="tab-item" :class="{'tab-active':order_by=='PRICE_ASC'||order_by=='PRICE_DESC'}">
               <div class="select">
                   <input type="text" v-model="getOrderBy" readonly @click="isShowSub"><i class="icon-down-dir"></i>
                   <ul v-if="showSubOrderBy">
                       <li @click="changeOrderBy('PRICE_ASC')">价格由低到高</li>
                        <li @click="changeOrderBy('PRICE_DESC')">价格由高到低</li>
                   </ul>
               </div>
            </div>
      </div>
      <goods-list :list="item_list"></goods-list>
  </div>
</template>
<script>
import GoodsList from '@/components/goods-list'
import Http from '@/utils/http'
import DropUp from '@/utils/dropup'
export default {
  components:{
      GoodsList
  },
  mounted(){
    //  if(sessionStorage.getItem('search_name')&&sessionStorage.getItem('search_name')!='undefined'){
    //      this.title=sessionStorage.getItem('search_name');
    //  }
    //  if(sessionStorage.getItem('search_category')&&sessionStorage.getItem('search_category')!='undefined'){
    //      this.category_id=sessionStorage.getItem('search_category');
    //  }
     if(this.$route.query.search_name){
         this.title=this.$route.query.search_name;
     }
     if(this.$route.query.search_category){
         this.category_id=this.$route.query.search_category;
     }
     if(sessionStorage.getItem('top_color')&&sessionStorage.getItem('top_color')!='undefined'){
         this.top_color=sessionStorage.getItem('top_color');
     }
     this.getProductList();
  },
  data(){
      return {
          item_list:[],
          order_by:'DEFAULT',       //排序方式
          title:'',                 //商品名称
          category_id:'',           //分类id
          showSubOrderBy:false,
          offset:0,                 //起始偏移量
          limit:10,                 //条目数量
          is_all:false,             //是否已加载完所有数据
          top_color:'',
      }
  },
  computed:{
      getOrderBy:function(){
          if(this.order_by=='PRICE_DESC'){
              return '价格由高到低';
          }else{
              return '价格由低到高';
          }
      }
  },
  methods:{
       //获取商品列表
      getProductList:function(){
          this.$vux.loading.show({
                text: '加载中'
            });
            let post_data={offset:this.offset,limit:this.limit,order_by:this.order_by}
            if(this.title){
                post_data.title=this.title;
                sessionStorage.removeItem('search_name');
            }
            if(this.category_id){
                post_data.category_id=this.category_id;
                sessionStorage.removeItem('search_category');
            }
            Http.get('/product/list/',post_data).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.item_list=res.data.item_list;
                    if(this.limit==this.item_list.length){
                       this.limit=2*this.limit;
                   }else{
                       this.is_all=true;
                   }
                }
            })
      },
      //搜索商品
      searchName:function(){
          this.limit=10;
          this.is_all=false;
          this.getProductList();
      },
       //上拉加载更多
       dropHandle:function(){
           if(!this.is_all&&DropUp.getDocumentTop('scrollContain')+DropUp.getWindowHeight('scrollContain')>=DropUp.getScrollHeight('scrollContain')){
                this.$vux.loading.show({
                    text: '加载中'
                });
                this.getProductList();
           }
       },
      //修改商品排序
      changeOrderBy:function(v){
          this.order_by=v;
          this.showSubOrderBy=false;
          this.getProductList();
      },
      //是否显示下拉框
      isShowSub:function(){
          if(this.order_by==='PRICE_ASC'||this.order_by==='PRICE_DESC'){
              this.showSubOrderBy=!this.showSubOrderBy;
          }else{
              if(this.getOrderBy==='价格由低到高'){
                  this.order_by='PRICE_ASC';
              }else{
                  this.order_by='PRICE_DESC';
              }
              this.showSubOrderBy=false;
              this.getProductList();
          }
      }
  }
}
</script>
<style scoped>
.header{
  height: 1.226667rem;
  background-color: #f36355;
}
.header img{
  width: .986667rem;
  height: .4rem;
  line-height: 1.226667rem;
  margin-left: .4rem;
  margin-top: .4rem;
}
.header .search{
  /* float: right; */
  margin-left: .373333rem;
  height: 1.226667rem;
  position: relative;
  color: #898989;
}
.header .search input{
  width: 5.8rem;
  height: .746667rem;
  font-size: .4rem;
  padding-left: .933333rem;
  border-radius: .346667rem;
  margin-top: .24rem;
}
.header .search i{
  position: absolute;
  left: .373333rem;
  font-size: .4rem;
  top: .24rem;
}
.tab{
    font-size: 0;
    /* overflow: hidden; */
    background-color: #ffffff;
    margin-bottom: .586667rem;
}
.tab .tab-item{
    font-size: .4rem;
     display: inline-block; 
    width: 33.333333%;
    height: 1.226667rem;
    line-height: 1.146667rem;
    text-align: center;
   
}
.tab .tab-active{
    color: #f56353;
    border-bottom: .08rem solid #f56353;
    height: 1.146667rem;
     font-weight: 600;
}
.tab .select{
    position: relative;
}
.tab .select input{
    border: none;
    font-size: .4rem;
    padding-left: .32rem;
    color: inherit;
    width: 100%;
    box-sizing: border-box;
}
.tab .select i{
    font-size: .4rem;
    position: absolute;
    right: .24rem;
    top: 0;
}
.tab .select ul{
    position: absolute;
    top: 1.226667rem;
    left: 0;
    z-index: 100;
    width: 100%;
    color: #000000;
    font-weight: normal;
}
.tab .select ul li{
    background-color: #ffffff;
    font-size: .4rem;
    line-height: 1.146667rem;
    border: 1px solid #dddddd;
}
</style>


