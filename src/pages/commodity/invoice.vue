<template>
  <div class="bg">
      <ul class="clearfix">
          <li>发票类型<i class="required">*</i>：</li>
          <li>
              <check-icon :value="invoice_type!=='NONE'" @click.native="invoice_type='PERSON'" >普通发票</check-icon>
          </li>
          <!-- <li>
              <check-icon :value="invoice_type==='NONE'" @click.native="invoice_type='NONE'">不开发票</check-icon>
          </li> -->
      </ul>
      <p class="note">注：仅支持普通发票，如需要增值税发票请联系客服</p>
      <ul class="clearfix" v-if="invoice_type!=='NONE'">
          <li>
              发票抬头<i class="required">*</i>：
          </li>
          <li>
              <check-icon :value="invoice_type=='PERSON'" @click.native="invoice_type='PERSON'"  >个人</check-icon>
              <input :key="'person'" type="text" placeholder="请填写发票抬头"  v-model="person_title">
          </li>
          <li>
              <check-icon :value="invoice_type=='COMPANY'" @click.native="invoice_type='COMPANY'" >企业</check-icon>
              <input :key="'company'" type="text" placeholder="请填写发票抬头"  v-model="company_title" maxlength="100">
          </li>
      </ul>
      <div class="tax clearfix" v-if="invoice_type=='COMPANY'">
          <label>添加税号（企业必填）：</label>
          <input type="text" ref="tax" placeholder="请填写纳税人识别号" v-model="invoice_tax_id" maxlength="32">
      </div>
      <button class="btn" @click="addInvoice">确认</button>
      <a class="history-link" @click="goback">返回>></a>
  </div>
</template>
<script>
import  CheckIcon  from 'vux-components/check-icon'
import Http from '@/utils/http'
export default {
    data(){
        return {
            invoice_type:'PERSON',   //发票类型
            invoice_title:'',       //发票抬头
            invoice_tax_id:'',      //发票税号
            person_title:'',        //个人发票抬头
            company_title:'',       //企业发票抬头
        }
    },
   components:{
       CheckIcon,
   },
   created(){
       if(sessionStorage.getItem('invoice_type')&&sessionStorage.getItem('invoice_type')!='undefined'){
           this.invoice_type=sessionStorage.getItem('invoice_type');
       }
       if(sessionStorage.getItem('invoice_title')&&sessionStorage.getItem('invoice_title')!='undefined'){
           this.invoice_title=sessionStorage.getItem('invoice_title');
           if(this.invoice_type=='PERSON'){
               this.person_title=this.invoice_title;
           }else{
               this.company_title=this.invoice_title;
           }
       }
       if(sessionStorage.getItem('invoice_tax_id')&&sessionStorage.getItem('invoice_tax_id')!='undefined'){
           this.invoice_tax_id=sessionStorage.getItem('invoice_tax_id');
       }
       if(this.invoice_type=='NONE'){
           this.invoice_type='PERSON';
       }
   },
   methods:{
       goback:function(){
           window.history.back();
       },
       //添加发票
       addInvoice:function(){
           if(this.invoice_type=='NONE'){
               sessionStorage.setItem('invoice_type',this.invoice_type);
               sessionStorage.setItem('invoice_title','');
               sessionStorage.setItem('invoice_tax_id','');
               window.history.back();
               return ;
           }
           if(!this.person_title&&this.invoice_type=='PERSON'){
               this.$vux.toast.text('请输入发票抬头');
               return ;
           }
           if(!this.company_title&&this.invoice_type=='COMPANY'){
               this.$vux.toast.text('请输入发票抬头');
               return ;
           }
           if(this.invoice_type=='COMPANY'&&!this.invoice_tax_id){
               this.$vux.toast.text('请输入发票税号');
               return ;
           }
           if(this.invoice_type=='COMPANY'&&/[\u4e00-\u9fa5|,]+/.test(this.invoice_tax_id)){
               this.$vux.toast.text('发票税号不能有汉字');
               return ;
           }
           let post_data={
               invoice_type:this.invoice_type,
               default:true,
               invoice_tax_id:this.invoice_tax_id
           };
           if(this.invoice_type==='PERSON'){
               post_data.invoice_title=this.person_title;
           }else if(this.invoice_type==='COMPANY'){
               post_data.invoice_title=this.company_title;
           }
           this.$vux.loading.show({
                text: '加载中'
            });
           Http.post('/invoice/add/',post_data).then(res=>{
               this.$vux.loading.hide();
               if(res.msg){
                   this.$vux.toast.text(res.msg);
               }else{
                   sessionStorage.setItem('invoice_type',this.invoice_type);
                   sessionStorage.setItem('invoice_title',post_data.invoice_title);
                   sessionStorage.setItem('invoice_tax_id',this.invoice_tax_id);
                   sessionStorage.setItem('invoice_id',res.data.invoice_id);
                //    this.$router.push('/confirm-order');
                   window.history.back();
               }
           });
           
       }
   }
}
</script>
<style scoped>
.bg{
    background-color: #f5f5f5;
    height: 100%;
    overflow-y: auto;
}
ul{
    background-color: #ffffff;
    padding-left: .533333rem;
    font-size: .4rem;
    line-height: 1.28rem;
}
ul li{
    border-bottom: 1px solid #dcdcdc;
}
ul li:last-child{
    border: none;
}
input[type=text]{
    text-align: right;
    font-size: .373333rem;
     float: right; 
    margin-right: .346667rem;
    border: none;
    height: 1.28rem;
}
.required{
    font-size: .426667rem;
    color: #f72300;
    font-style: normal;
}
.note{
    font-size: .32rem;
    line-height: .613333rem;
    margin-left: 1.093333rem;
    opacity: 0.5;
}
.tax{
    background-color: #ffffff;
    font-size: .4rem;
    line-height: 1.36rem;
    padding-left: .533333rem;
}
.btn{
    width: 6.346667rem;
    height: 1.013333rem;
    display: block;
    font-size: .426667rem;
    color: #ffffff;
    background-color: #f36355;
    border: none;
    border-radius: .106667rem;
    margin-top: 1.333333rem;
    margin-left: auto;
    margin-right: auto;
}
.history-link{
    font-size: .426667rem;
    color: #f36355;
    display: block;
    margin-top: .48rem;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    text-decoration: underline;
}
</style>


