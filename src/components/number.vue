<template>
    <div class="number">
        <label class="btn" @click="sub">-</label>
        <!-- <label class="content">{{value}}</label> -->
        <input class="content"  v-model="value" type="number" readonly >
        <label class="btn" @click="add">+</label>
    </div>
</template>
<script>
export default {
  props:{
      initvalue:{
          type:Number,
          default:1
      },
      min:{
          type:Number,
          default:1
      },
      max:{
          type:Number,
          default:1000
      }
  },
  data(){
    
    return {value:this.initvalue};
  },
  watch:{
        initvalue(newValue){
            this.value=newValue;
        },
        value (newValue, old) {
            if (newValue !== '') {
                if (typeof this.min !== 'undefined' && this.value < this.min) {
                this.value = this.min
                }
                if (this.max && this.value > this.max) {
                this.value = this.max
                }
            }
            if(Number.isInteger(this.value)){
                this.$emit('input', this.value);
                this.$emit('on-change', this.value);
            }
            
            },
        },
 
  methods:{
      add(){
          if(this.value<this.max){
            return this.value++;
          }
        
      },
      sub(){
          if(this.value>this.min){
             return this.value--;
          }
      }
  }

}
</script>
<style scoped>
    .number{
        display: inline-block;
        height: .613333rem;
        border-radius: .106667rem;
        background-color: #ffffff;
        border: 2px solid #bfbfbf;
    }
    .number label,input{
        display: inline-block;
        text-align: center;
    }
    .number .btn{
        width: .666667rem;
        /* height: 100%; */
        line-height: .613333rem;
        background-color: #e5e5e5;
    }
    .number .content{
        width: .8rem;
        height: 100%;
        
    }
</style>


