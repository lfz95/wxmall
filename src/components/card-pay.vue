<template>
  <div class="dialog"  >
		<div class="dialog-content">
		    <div class="close" @click="close"></div>
			<p class="head">请输入支付密码</p>
			<div class="line"></div>
			<p class="pay-title">微商城账户</p>
			<p class="amount">¥68.00</p>
            <div class="line"></div>
            <p class="card">会员卡 （6630******0037）</p>
            <div class="line"></div>
			<input type="tel"  class="input" />
			<div class="group" >
				<div class="cell " :class="{dotcell:password.length>=1}">
				</div><div class="cell" :class="{dotcell:password.length>=2}">
				</div><div class="cell" :class="{dotcell:password.length>=3}">
				</div><div class="cell" :class="{dotcell:password.length>=4}">	
				</div><div class="cell" :class="{dotcell:password.length>=5}">
				</div><div class="cell" :class="{dotcell:password.length>=6}"></div>
			</div>
			
		</div>
		<div class="keyboard">
				<table>
					<tr>
						<td @click="inputHandle('1')">
							<label>1</label>
							<p>&nbsp;</p>
						</td>
						<td @click="inputHandle('2')">
							2
							<p>ABC</p>
						</td>
						<td @click="inputHandle('3')">
							3
							<p>DEF</p>
						</td>
					</tr>
					<tr>
						<td @click="inputHandle('4')">
							4
							<p>GHI</p>
						</td>
						<td @click="inputHandle('5')">
							5
							<p>JKL</p>
						</td>
						<td @click="inputHandle('6')">
							6
							<p>MNO</p>
						</td>
					</tr>
					<tr>
						<td @click="inputHandle('7')">
							7
							<p>PQRS</p>
						</td>
						<td @click="inputHandle('8')">
							8
							<p>TUV</p>
						</td>
						<td @click="inputHandle('9')">
							9
							<p>WXYZ</p>
						</td>
					</tr>
					<tr>
						<td class="gray-bg">
							
						</td>
						<td @click="inputHandle('0')">
							0
							
						</td>
						<td class="gray-bg" @click="inputHandle('del')">
							<i class="icon-cancel-alt-filled"></i>
						</td>
					</tr>
				</table>
			</div>
	</div>
</template>
<script>
export default {
   data(){
	   return {
		   password:[]
	   }
   },
   methods:{
	   inputHandle:function(v){
			if(v==='del'){
				if(this.password.length>0){
					this.password.pop();
				}
			}else{
				this.password.push(v)
			}
			if(this.password.length==6){
				this.$emit('close-pay',this.password.join(''));
			}
	   },
	   close:function(){
		   this.$emit('close-pay')
	   }
   }
}
</script>
<style scoped>
/*  遮罩层弹框   */
.dialog{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color:rgba(219,219,219,0.5);
  z-index: 100;
  font-size: 1rem;
}
.dialog-content{
  position: absolute;
  top: 16%;
  left: 17%;
  width: 69.6%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.133333em;
  background-color: #ffffff;
  padding-top: 0.506667em;
  text-align: center;
}
.dialog-content .head{
	font-size: .453333em;
    line-height: 1em;
    padding-bottom: .8235em;
}
.dialog-content .close{
	position: absolute;
	right: .48em;
	top: 0.6em;
	width: 0.5em;
	height: 0.106667em;
	background-color: #a6a6a6;
	transform: rotateZ(45deg);
}
.dialog-content .close:after{
	content: '';
	position: absolute;
	left: 0;
	top: 0;
	width: 0.5em;
	height: 0.106667em;
	background-color: #a6a6a6;
	transform: rotateZ(90deg);
}
.dialog-content .line{
	width: 100%;
	border-top: 1px solid #aaaaaa;
	/* margin-top: 0.48em; */
}
.dialog-content .pay-title{
	font-size: 0.4em;
	line-height: 1em;
	margin-top: 1.2em;
}
.dialog-content .amount{
	font-size:.693333em;
    margin-top: 0.52em;
    margin-bottom: .6923em;
	line-height: 1em;
}
.dialog-content .input{
	opacity: 0;
	display: none;
}
.dialog-content .card{
    font-size: .4em;
    line-height: 2.4em;
}
.dialog-content .group{
	margin-top: .346667em;
	height: 1.653333em;
}
.dialog-content .cell{
	display: inline-block;
	width: 0.96em;
	height: 0.933333em;
	border: 0.013333em solid #898989;
}
.dialog-content .dotcell{
	position: relative;
}
.dialog-content .dotcell:before{
	position: absolute;
	top: 50%;
	left: 50%;
	content: '';
	width: 0.6em;
	height: 0.6em;
	margin-top: -0.3em;
	margin-left: -0.3em;
	border-radius: 50%;
	background-color: #000000;
}
.keyboard{
	position: absolute;
	bottom: 0;
	background-color: #ffffff;
	width: 100%;
}
.keyboard table{
	width: 100%;
	text-align: center;
	font-size: 0.6em;
}
.keyboard table td{
	width: 33.3333%;
	border: 1px solid #dcdcdc;
	height: 2.1778em;
}
.keyboard table td:last-child{
	border-right: none;
}
.keyboard table td:first-child{
	border-left: none;
}
.keyboard table .gray-bg{
	background-color: #d4d8db;
}
.keyboard table p{
	font-size: 0.4em;
	font-weight: normal;
}
.keyboard table i{
	font-size: .8em;
}
</style>


