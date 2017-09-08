<template>
	<div class = 'logincontainer'>
		<img src = '../img/logo.png'  />
		<form>
			<input type = 'text' ref = 'phone' placeholder="手机号" />
			<div class = 'yanzheng' >
				<input type = 'text' ref = 'ipt'  placeholder="短信验证码"/>	
				<button :flag = 'flag ? false : true' @click = "inte()" class = 'yanzhengbtn' ref  = 'yanzheng'>获取验证码</button>
			</div>
			<button @click="click()" class = 'btn'>登录</button>
		</form>
		<div class = 'tip'>
			
		</div>
		<div class = 'bottom'>
			<p>未注册的用户登录后自动创建账户</p>
			<p>登录即表示您同意<a href = 'https://topic.ricebook.com/topicpage/agreement.html'>用户协议</a></p>
		</div>
		
	</div>
</template>

<script>
	import Toast from './../md/Toast.js';
	export default{
		data(){
			return{
				flag : true
			}
		},
		methods:{
			inte(){
				var that = this;
				var num = 60;
				if($(that.$refs.phone).val() == ''){
					alert("请输入手机号");
				}
				if(that.flag == true && $(that.$refs.phone).val() !== ''){
					setTimeout(function(){
						$(that.$refs.ipt).val(Math.floor(Math.random()*9000)+1000)
					},Math.random()*10000)
					var timer = setInterval(function(){
						num -- ;
						$(that.$refs.yanzheng).html(num);
						if(num == 0){
							$(that.$refs.yanzheng).html('超时');
							clearInterval(timer);
						};
						console.log()
						if($(that.$refs.ipt).val() !== ''){
							$(that.$refs.yanzheng).html('已获取');
							clearInterval(timer);
						}
					},1000)
					that.flag = false;
				}
			},
			click(){
				var that = this;
				var res = /^[0-9]*$/
				if(!res.test($(that.$refs.phone).val())){
					alert("请输入正确格式");
				}else if($(that.$refs.phone).val() == '' || $(that.$refs.ipt).val() == ''){
					alert("请填写完整内容");
				}else{
					localStorage.setItem('isLogin',1);
					localStorage.setItem('userID',$(that.$refs.phone).val());
					that.$router.push('/more');
				}
			}
		}
	}
</script>

<style scoped>
	.tip{         
         background:rgba(0,0,0,0.4);
         display: none;
         height:40px;
         text-align: center;
         line-height: 40px;
         color: #fff;
         position: absolute;
         padding: 7px;
         top:400px;
     }
	.logincontainer{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding:20px;
	}
	img{
		width:45%;
		margin-top:30px;
	}
	form{
		width:100%;
		margin-top:50px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	input{
		width:100%;
		margin:10px 0;
		height:40px;
		padding:10px;
		box-sizing: border-box;
		border-radius: 5px;
		border: 1px solid #666;
		outline:none;
		border-color:darkgray;
	}
	.yanzheng input{
		width:50%
	}
	.yanzhengbtn{
		padding:10px 20px;
		float:right;
		width:122px;
		height:43px;
		margin:10px 0;
		border:1px solid darkgray;
		color:darkgray;
		background: #fff;
		box-sizing: border-box;
	}
	.btn{
		width:100%;
		display: block;
		height:50px;
		background: #000;
		color:#fff;
		border:0;
		margin:10px 0;
	}
	.bottom{
		margin-top:100px;
		text-align: center;
		font-size: 12px;
		color:darkgray
	}
	.bottom p{
		margin:5px 0;
	}
	.bottom a{
		text-decoration: underline;
	}
</style>