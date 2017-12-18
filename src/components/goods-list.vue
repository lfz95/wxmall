<template>
  <div>
  	<div v-for="(item,index) in list" :key="item.item_id" class="hot-item" @click="goDetail(item)" >
  		<img :src="image_url(item)">
  		<p class="name"><i>{{item.virtual=='Y'?'卡券':'实物'}}</i>{{item.title}}</p>
  		<p class="amount">{{'¥'+item.fixed_price}}</p>
  	</div>
  </div> 
</template>
<script>
import Config  from '@/utils/config'
export default {
    props:{
      list:{
        require:true,
        Type:Array
      }
    },
    mounted(){
      console.log(this.list);
    },
    methods:{
      goDetail:function(item){
        this.$router.push({name:'commodity-detail', params: {id:item.item_id}});
      },
      image_url:function(item){
        return Config.image_url(item);
      }
    }
}
</script>
<style scoped>
.hot-item{
  width: 4.56rem;
  height: 5.546667rem;
  border: 2px solid #dddddd;
  margin-left: .213333rem;
  margin-bottom: .346667rem;
  background-color: #ffffff;
  display: inline-block;
  overflow: hidden;
}
.hot-item img{
  object-fit: cover;
  width: 100%;
  height: 4.24rem;
  margin: 0 auto;
  display: block;
}
.hot-item .name{
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: .373333rem;
  margin-left: .213333rem;
  margin-bottom: .2rem;
  overflow: hidden;
}
.hot-item .name i{
  width: .56rem;
  height: .32rem;
  display: inline-block;
  border-radius: .053333rem;
  font-style: normal;
  font-size: .266667rem;
  line-height: .32rem;
  vertical-align: .053333rem;
  color: #ffffff;
  background-color: #7f007f;
}
.hot-item .amount{
  font-size: .373333rem;
  color: #f21a18;
  margin-left: .213333rem;
}
</style>


