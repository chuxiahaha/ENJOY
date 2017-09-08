<template>
	<div class="commonHeader">
		<div class="back" @click="gohome()">首页</div>
		<div class="title">ENJOY<span class="citynames">{{name}}</span><span><i class="iconfont">&#xe643;</i> </span></div>
		<div class="moreInfo">
			<i class="iconfont" @click="goLogin">登录</i>
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
				id:"",
				name:"",
				auto:false,
				keyword:""
			}
		},
		methods:{
			gohome(){
				router.push({path:"home"})
			},
			goLogin(){
				router.push({path:"login"})
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
		},
		mounted(){
			var that=this;
			var id =localStorage.getItem("id");
			var name =localStorage.getItem("name1");
			that.id=id;
			that.name=name;
		}
	}
</script>

<style>
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
		background: #fff;
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
		padding-left: 4%;
		display: inline-block;
		float: left;
		color: #000;
		font-size: 12px;
		margin-top: 6%;
	}
</style>