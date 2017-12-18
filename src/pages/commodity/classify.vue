<template>
  <div >
      <div class="header clearfix" :style="{backgroundColor:top_color}">
        <div class="search">
            <input type="search" placeholder="搜索商城商品" v-model="search" @keyup.enter="searchName(search)">
            <i class="icon-search" @click="searchName(search)"></i>
        </div>
    </div>
      <div>
        <div class="left-tab">
            <ul>
                <li v-for="(item,index) in item_category_list" :key="item.category_id" :class="{active:select_item_idx===index}" @click="changeSelect(index,item)">{{item.category_name}}</li>
                
            </ul>
        </div>
          <div class="right-tab">
             <div class="item" v-for="sub in subListOrderBy" :key="sub.category_id" @click="searchCategory(sub.category_id)">
                 <img :src="getImgUrl(sub)">
                 <label>{{sub.category_name}}</label>
             </div>
             
          </div>
          
      </div>
  </div>
</template>
<script>
import { Grid, GridItem } from 'vux-components/grid'
import Http from '@/utils/http'
import Config from '@/utils/config'
export default {
   components:{
       Grid,
       GridItem
   },
   data(){
       return {
           item_category_list:[],
           select_item_idx:0,
           select_item:[],
           search:'',
           top_color:''
       }
   },
   created(){
    this.$vux.loading.show({
      text: '加载中'
    });
  },
   mounted(){
       Http.get('/product/category/').then(res=>{
           this.$vux.loading.hide();
           if(res.msg){
               this.$vux.toast.text(res.msg);
           }else{
               this.item_category_list=res.data.item_category_list;
               if(this.item_category_list[0].sub_category_list){
                   this.select_item=this.item_category_list[0].sub_category_list;
               }
               
           }
       });
       if(sessionStorage.getItem('top_color')&&sessionStorage.getItem('top_color')!='undefined'){
            this.top_color=sessionStorage.getItem('top_color');
        }
   },
   computed:{
       //子级分类排序
       subListOrderBy:function(){
           if(this.select_item.length>0){
               return this.select_item.sort(function(a,b){
                   return a.sorting-b.sorting;
               })
           }else{
               this.select_item=[];
           }
       },
       //父级分类排序
       category_list:function(){
           if(this.item_category_list.length>0){
               return this.item_category_list.sort(function(a,b){
                   return a.sorting-b.sorting;
               })
           }
       }
   },
   methods:{
       changeSelect:function(idx,item){
           if(item.sub_category_list){
               this.select_item=item.sub_category_list;
           }else{
               this.select_item=[];
           }
           this.select_item_idx=idx;
       },
       searchName:function(data){
            sessionStorage.setItem('search_name',data);
           this.$router.push({ path: '/all-commodity',query:{search_name:data} });
       },
       searchCategory:function(data){
            sessionStorage.setItem('search_category',data);
           this.$router.push({ path: '/all-commodity',query:{search_category:data} });
       },
       //获取二级分类图片
       getImgUrl:function(item){
           return Config.categoryImgUrl(item.category_id);
       },
   }
}
</script>
<style scoped>

.header{
  height: 1.12rem;
  background-color: #f36355;
}
.header .search{
  height: 1.12rem;
  position: relative;
  color: #898989;
  text-align: center;
  line-height: .426667rem;
}
.header .search input{
  width: 9.2rem;
  height: .8rem;
  font-size: .4rem;
  padding-left: .933333rem;
  border-radius: .346667rem;
  margin-top: .186667rem;
  text-align: center;
}
.header .search i{
  position: absolute;
  left: 3.44rem;
  font-size: .4rem;
  top:.373333rem;
}
.left-tab{
    background-color: #eeeeee;
    font-size: .453333rem;
    line-height: 1.573333rem;
    width: 2.373333rem;
    text-align: center;
    position: fixed;
    left: 0;
    bottom: 0;
    top:  1.13rem;
    overflow-y: scroll;
}
.left-tab::-webkit-scrollbar{
    display: none;
}
.left-tab .active{
    background-color: #ffffff;
    color: #ff5638;
}
.right-tab{
    margin-left: 2.373333rem;
    /* margin-top: 1.12rem; */
    background-color: #ffffff;
}
.right-tab .item{
    font-size: .426667rem;
    width: 33.33%;
    height: 2.88rem;
    text-align: center;
    margin-top: .666667rem;
    float: left;
}
.right-tab .item img{
    width: 100%;
    height: 2.474rem;
}
</style>


