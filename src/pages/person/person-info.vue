<template>
 <div class="bg" v-if="person_info">
     <div class="header">
        <img src="../../assets/images/person_logo.png">
        <!-- <p class="title">登录名：{{person_info.login_name}}</p> -->
     </div>
     <ul class="list clearfix">
        <li>
            <label class="left">昵称</label>
            <input type="text" placeholder="未填写" class="input" v-model="person_info.nickname" maxlength="10">
        </li>
        <li>
            <label class="left">卡号</label>
            <input type="tel" placeholder="未填写" class="input readonly" v-model="person_info.card_id" readonly>
        </li>
        <li>
            <label class="left">手机号</label>
            <input type="tel" placeholder="未填写" class="input readonly" v-model="person_info.mobile_no" readonly>
        </li>
        <li>
            <label class="left">邮箱</label>
            <input type="email" name="email" placeholder="未填写" class="input" v-model="person_info.email">
        </li>
        <li>
            <label class="left">身份证</label>
            <input type="text" placeholder="未填写" class="input" v-model="person_info.id_card_no">
        </li>
     </ul>
     <button class="btn" @click="editUser">保存</button>
     <!-- <p class="remark">注:卡号和手机号在商城中无法修改,请前往卡系统-会员中心-我的资料中进行修改。<a href="">前往修改</a></p> -->
 </div> 
</template>
<script>
import Http from '@/utils/http'
export default {
    data(){
        return {
            person_info:null
        }
    },
    mounted(){
        //获取用户信息
        Http.get('/security/user/').then(res=>{
            if(res.msg){
                this.$vux.toast.text(res.msg);
            }else{
                this.person_info=res.data;
            }
        });
       
    },
    methods:{
        //修改用户信息
        editUser:function(){
            if(!this.person_info.nickname){
                this.$vux.toast.text('请输入昵称');
                return ;
            }
            var reg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
            if(this.person_info.email&&!reg.test(this.person_info.email)){
                this.$vux.toast.text('邮箱输入错误');
                return ;
            }
            if(this.person_info.id_card_no&&!/^\d{17}(\d|x)$/i.test(this.person_info.id_card_no)){
                this.$vux.toast.text('身份证输入错误');
                return ;
            }
            this.$vux.loading.show({
                text: '加载中'
            });
            Http.post('/security/user/',this.person_info).then(res=>{
                this.$vux.loading.hide();
                if(res.msg){
                    this.$vux.toast.text(res.msg);
                }else{
                    window.history.back();
                }
            });
        }
    }
}
</script>
<style scoped>
.header{
    height: 3.52rem;
    background: url('../../assets/images/person_bg.png') no-repeat center center;
    background-size: 100% 100%;
    text-align: center;
}
.header img{
    width: 1.68rem;
    height: 1.68rem;
    border-radius: 50%;
    margin-top: .666667rem;
}
.header .title{
    line-height: .426667rem;
    margin-top: .28rem;
    font-size: .4rem;
}
.list{
    padding-left: .426667rem;
    background-color: #ffffff;
    line-height: 1.36rem;
    font-size: .4rem;
}
.list li{
    border-bottom: 1px solid #d1d1d1;
}
.list li:last-child{
    border: none;
}
.list .left{
    /* font-weight: 600; */
    margin-left: .16rem;
}
.list .input{
    border: none;
    font-size: .4rem;
    height: 1.2rem;
    float: right;
    text-align: right;
    margin-right: .373333rem;
    min-width: 5.4rem;
}
.list .readonly{
    opacity: .6;
}
.btn{
    width: 5.946667rem;
    height: 1.066667rem;
    background-color: #f36355;
    color: #ffffff;
    border: none;
    border-radius: .133333rem;
    font-size: .48rem;
    display: block;
    margin-top: 1.6rem;
    margin-left: auto;
    margin-right: auto;
}
.remark{
    font-size: .346667rem;
    line-height: .373333rem;
    width: 9.28rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: .4rem;
}
.remark a{
    color: #fc5f6b;
    text-decoration: underline;
}
</style>


