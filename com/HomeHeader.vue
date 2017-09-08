<template>
	<div class="commonHeader">
		<div class="back" @click="gokind()">分类</div>
		<div class="title" @click="gowhere()">ENJOY<span class="citynames">{{proname}}</span><span><i class="iconfont">&#xe643;</i> </span></div>
		<div class="moreInfo">
			<i class="iconfont" @click="goLogin">登录
			<div class="denglu" v-if="chu">
				<ul>
					<li>我的订单</li>
					<li>我的礼券</li>						
					<li class="out" @click="goout">登出</li>						
				</ul>
			</div>			
			</i>
			<i class="iconfont" @click = "gosearch()">&#xe651;</i>
		</div>
		<div class="searchbox" v-show = "auto">
			<input type="text" name="search" id="search" value="" placeholder="搜索本地精选/快递到家" />
			<span @click = "checksearch()">搜索</span>
		</div>
	</div>
</template>

<script>
	import "./../scss/main.scss";
	import router from "./../router/router.js";
	export default {
		data(){
			return {
				proname:"上海",
				auto:false,
				keyword:"",
				chu:false				
			}
		},
		methods:{
			gokind(){
				router.push({path:"prochoose"})
			},
			gowhere(){
				$(".city").toggle(),
				$(".homecon").toggle()
			},
			goLogin(event){
				var that=this;
				var aaa=localStorage.getItem("isLogin")
				
				if(aaa=="1"){
				that.chu=true;
				}else{
						router.push({path:"login"})
				}		
			},
			goout(){
				var that=this;
				localStorage.removeItem("isLogin");
				localStorage.removeItem("userID");				
			},			
			gosearch(){
				var that = this;
			 	if(that.auto == false){
			 		that.auto = true;
			 	}else{
			 		that.auto = false;
			 	}
			},
			checksearch(){
				var that = this;
				that.keyword = $("#search").val();
				that.$router.push({path:"/search",query:{keyword:that.keyword}});
			}
		}
	}
</script>
	
<style scoped>
	.commonHeader{
		position: relative;
	}
	
	.back{
		font-size: 14px;
	}
	.title{
		font-size: 14px;
	}
	.title span:nth-of-type(1){
		font-size: 8px;
	}
	.title i{
		font-style: inherit;
		
	}
	.moreInfo .iconfont{
			display: inline-block;
			font-size: 14px;
			width: 50px;
			float: left;
			font-style: inherit;
	}
	.searchbox{
		width: 100%;
		height: 45px;
		position: fixed;
		top: 40px;
		left: 0;
		z-index: 100;
	}
	#search{
		text-indent: 12px;
		display: block;
		height: 25px;
		width: 70%;
		margin-left: 10%;
		float: left;
		font-size: 12px;
		background-color: #eee;
		border: none;
		margin-top: 4%;
		outline: none;
	}
	.searchbox span{
		width: 10%;
		display: inline-block;
		float: left;
		color: #000000;
		font-size: 12px;
		margin-top: 5%;
	}
	.denglu{
		width: 80px;
		height: 80px;
		font-size: 14px;
		background:#fff;
		position: absolute;
		z-index: 100;
		color: #666;
		top: 45px;
	}
	.denglu li{
		line-height: 26px;
		border-bottom: 1px solid #eee;
	}
	
</style>