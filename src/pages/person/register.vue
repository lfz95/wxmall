<template>
  <div class="bg contain">
      <p class="first">请输入注册手机号</p>
      <input type="tel" class="long" v-model="phone_no" maxlength="11">
      <p class="valid">请输入短信验证码</p>
      <input type="tel" v-model="verify_code"><button class="valid-btn" @click="sms">{{timer==60?'发送验证码':'重新发送'+timer}}</button>
      <p class="agreement">注册账号就视为已同意<label>微商城协议</label></p>
      <button class="register-btn" @click="register">注册</button>
  </div>
</template>
<script>
import Http from '@/utils/http'
export default {
    data(){
        return {
            phone_no:'',
            verify_code_sn:'',
            verify_code:'',
            timer:60
        }
    },
    methods:{
        //发送短信验证码
        sms:function(){
            //重发倒计时中，不允许发送
            if(this.timer!=60){
                return ;
            }
            if(!this.phone_no){
                this.$vux.toast.text('请输入手机号');
                return ;
            }
            this.clock();
            Http.post('/security/sms/',{phone_no:this.phone_no,usage:'10'}).then(res=>{
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    this.verify_code_sn=res.data.verify_code_sn;
                }
            })
        },
        //发起注册申请
        register:function(){
            if(!this.phone_no){
                this.$vux.toast.text('请输入手机号');
                return ;
            }
            if(!/^1[0-9]{10}$/.test(this.phone_no)){
                this.$vux.toast.text('手机号输入错误');
                return ;
            }
            if(!this.verify_code){
                this.$vux.toast.text('请输入短信验证码');
                return ;
            }
            this.$vux.loading.show({
                text: '加载中'
            });
            let post_data={phone_no:this.phone_no,verify_code_sn:this.verify_code_sn,verify_code:this.verify_code};
            Http.post('/security/register/',post_data).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    // this.verify_code_sn=res.data.verify_code_sn;
                    window.history.back();
                }
            })
        },
        //倒计时
        clock:function(){
            let self=this;
            let coc=window.setInterval(function(){
                if(self.timer==0){
                    self.timer=60;
                    clearInterval(coc);
                }else{
                    self.timer--;
                }
            },1000)
        }
    }
}
</script>
<style scoped>
.contain{
    font-size: .4rem;
    padding-left: .426667rem;
    padding-right: .48rem;
}
p{
    line-height: .426667rem;
}
.first{
    padding-top: .986667rem;
    margin-bottom: .24rem;
}
.valid{
    margin-top: .346667rem;
    margin-bottom: .213333rem;
}
.long{
    width: 8.6rem;
}
input{
    height: 1.066667rem;
    border: 1px solid #959595;
    border-radius: .08rem;
    padding-left: .48rem;
    width: 4.8rem;
    font-size: .48rem;
}
button{
    height: 1.066667rem;
    background-color: #f36355;
    border: none;
    border-radius: .133333rem;
    color: #ffffff;
}
.valid-btn{
    width: 3.253333rem;
    margin-left: .48rem;
}
.agreement{
    margin-top: .933333rem;
    margin-bottom: .426667rem;
}
.agreement label{
    color: #f36355;
    text-decoration: underline;
    margin-left: .106667rem;
}
.register-btn{
    width: 100%;
    font-size: .533333rem;
}
</style>

