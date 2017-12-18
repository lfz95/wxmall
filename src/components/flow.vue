<template>
  <div>
      <div class="flow">
          <div class="contain">
              <template v-for="(item,index) in flowdata ">
                <div class="circle" :class="{done:step>=index}" :key="'circle'+index"><p :class="{last:index==flowdata.length-1,first:index==0}">{{item}}</p></div>
                <div class="line" v-if="index!=flowdata.length-1" :key="'line'+index" :style="{width:lineWidth}"></div>
              </template>
          </div>
            <p class="state" :class="{'only-state':flowdata.length==0}">订单状态：{{state}}</p>
      </div>
  </div>
</template>
<script>
export default {
   props:{
       flowdata:{
           type:Array,
           require:true
       },
       step:{
           default:0,
           type:Number
       },
       state:{
           require:true,
           type:String
       }
   },
   computed:{
       //计算虚线宽度
       lineWidth:function(){
           //5.8是圆圈宽度加上inline-block的间隔宽度占据的百分比
            let w=(100-6*this.flowdata.length)/(this.flowdata.length-1);
            return w+'%';
       }
   }
}
</script>
<style scoped>
.flow{
    height: 2.32rem;
    background-color: #f36355;
    color: #ffffff;
    padding: 0 .48rem;
    overflow-x: hidden;
}
.flow .contain{
    margin-left: .4rem;
}

.flow .circle{
    display: inline-block;
    position: relative;
    border: .026667rem solid #ffffff;
    border-radius: 50%;
    width: .24rem;
    height: .24rem;
    margin-top: .7rem;
}
.flow .circle p{
    font-size: .32rem;
    position: absolute;
    top: -.533333rem;
    left: -1.1rem;
    text-align: center;
    line-height: .346667rem;
    min-width: 2.5rem;
}
.flow .circle .last{
    left: -1.3rem;
}
.flow .circle .first{
    left: -.8rem;
}
.flow .done{
    top: .066667rem;
    border: none;
    border-radius: 50%;
    width: .426667rem;
    height: .426667rem;
    background:url('../assets/images/correct.png') no-repeat center center;
    background-size: 100% 100%;
}
.flow .done p{
    top: -.426667rem;
}
.flow .line{
    /* width: 3.466667rem; */
    border-top: 2px dashed #ffffff;
    display: inline-block;
    height: .12rem;
    vertical-align: baseline;
}
.flow .state{
    font-size: .4rem;
    font-weight: 600;
    line-height: .453333rem;
    margin-top: .36rem;
}
.flow .only-state{
    line-height: 1.86rem;
    font-size: .48rem;
}
</style>


