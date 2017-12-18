<template>
  <div class="bg">
      <div class="tax">
        <ul>
            <li>
                <check-icon :value="select_invoice==nouse"  @click.native="select_invoice=nouse"></check-icon>
                <label>发票类型</label>
                <span class="right-title">不开发票</span>
            </li>
            <!-- <li>
                发票抬头
            </li> -->
            
        </ul>
      </div>
      <div class="tax" v-for="tax in invoices" :key="tax.invoice_id">
          <div class="clearfix">
            <div class="right-title">
                <label class="time">创建于{{formatDate(tax.insert_time) }}</label>
                <a class="delete" @click="deleteInvoice(tax.invoice_id)">删除</a>
            </div>
         </div>
          
        <ul @click="select_invoice=tax">
            <li>
                <check-icon :value="select_invoice==tax" ></check-icon>
                <label>发票类型</label>
                <span class="right-title">{{invoiceType(tax.invoice_type)}}</span>
            </li>
            <li>
                发票抬头
            </li>
            <li v-if="tax.invoice_type=='PERSON'">
                <label>个人</label>
                <span class="right-title">{{tax.invoice_title}}</span>
            </li>
            <template v-if="tax.invoice_type=='COMPANY'">
            <li>
                <label>企业</label>
                <span class="right-title">{{tax.invoice_title}}</span>
            </li>
            <li>
                <label>纳税人编号</label>
                <span class="right-title">{{tax.invoice_tax_id}}</span>
            </li>
            </template>
        </ul>
      </div>
      
      <button class="btn" @click="useSelect">使用</button>
      <router-link tag="button" to="/invoice" class="add-btn" >添加</router-link>
  </div>
</template>
<script>
import  CheckIcon  from 'vux-components/check-icon'
import Http from '@/utils/http'
export default {
   components:{
       CheckIcon
   },
   data(){
       return {
           invoices:[],
           select_invoice:null,
           nouse:{
               invoice_type:'NONE'
           }
       }
   },
   created(){
       this.getInvoiceList();
   },
   methods:{
       //获取发票历史列表
       getInvoiceList:function(){
           Http.get('/invoice/list/').then(res=>{
               if(res.msg){
                   this.$vux.toast.text(res.msg);
               }else{
                   this.invoices=res.data.invoices;
                   if(this.invoices.length==0){
                       this.$vux.toast.text('请添加发票');
                   }
                   if(sessionStorage.getItem('invoice_id')&&sessionStorage.getItem('invoice_id')!='undefined'){
                       let id=sessionStorage.getItem('invoice_id');
                       this.select_invoice=this.invoices.find(item=>item.invoice_id==id)||nouse;
                   }else{
                       this.select_invoice=this.nouse;
                   }
               }
           })
       },
       //删除发票历史记录
       deleteInvoice:function(id){
           Http.post('/invoice/remove/',{invoice_id:id}).then(res=>{
               if(res.msg){
                   this.$vux.toast.text(res.msg);
               }else{
                   this.getInvoiceList();
                   
               }
           })
       },
       //发票类型
       invoiceType:function(val){
           if(val==='NONE'){
               return '不开发票';
           }else if(val==='PERSON'||val==='COMPANY'){
               return '普通发票'
           }
       },
       //使用选中的发票信息
       useSelect:function(){
           if(!this.select_invoice){
               this.$vux.toast.text('请选择要使用的发票');
               return ;
           }
           sessionStorage.setItem('invoice_type',this.select_invoice.invoice_type);
           sessionStorage.setItem('invoice_title',this.select_invoice.invoice_title);
           if(this.select_invoice.invoice_type=='COMPANY'){
               sessionStorage.setItem('invoice_tax_id',this.select_invoice.invoice_tax_id);
           }
           if(this.select_invoice!=this.nouse){
               sessionStorage.setItem('invoice_id',this.select_invoice.invoice_id);
           }else{
               sessionStorage.setItem('invoice_id','');
           }
        //    this.$router.push('/confirm-order');
            window.history.go(-1);
       },
       formatDate:function(v){
           if(v){
               return v.substring(0,4)+'-'+v.substring(4,6)+'-'+v.substring(6,8);
           }
       }
   },
}
</script>

<style scoped>
.bg{
    background-color: #f5f5f5;
    height: 100%;
    overflow-y: auto;
}
.tax{
    padding-top: .4rem;
    font-size: .4rem;
}
.tax .right-title{
    float: right;
    margin-right: .373333rem;
}
.tax .delete{
    line-height: .426667rem;
    font-size: .373333rem;
    color: #f78784;
    text-decoration: underline;
}
.tax .time{
    opacity: 0.6;
    margin-right: .346667rem;
    line-height: .426667rem;
    font-size: .373333rem;
}
.tax ul{
    background-color: #ffffff;
    line-height: 1.333333rem;
    padding-left: .88rem;
}
.tax ul li:first-child{
    border-bottom: 1px solid #dcdcdc;
}
.btn{
    width: 6.346667rem;
    height: 1.04rem;
    background-color: #f36355;
    color: #ffffff;
    font-size: .453333rem;
    display: block;
    margin-top: 1.146667rem;
    margin-left: auto;
    margin-right: auto;
    border: none;
    border-radius: .106667rem;
}
.add-btn{
    color: #f36355;
    background-color: #ffffff;
    border: none;
    width: 6.346667rem;
    height: 1.04rem;
    border: 1px solid #f36355;
    box-shadow: 0 0 1px #f36355 inset;
    border-radius: .106667rem;
    font-size: .453333rem;
    display: block;
    margin: 0 auto;
    margin-top: .4rem;
    margin-bottom: .4rem;
}
</style>

