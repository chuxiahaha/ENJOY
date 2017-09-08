<template>
	<ul class="foor">
		<li> <router-link to="./home"><i class="iconfont">&#xe617;</i></router-link> </li>
		<li> <router-link to="./kind"><i class="iconfont">&#xe627;</i></router-link> </li>
		<li @click = "hasLogin"> <router-link to="./user"><i class="iconfont">&#xe603;</i></router-link> </li>
		<li @click = "hasMore"> <router-link to="./more"><i class="iconfont">&#xe602;</i></router-link> </li>
	</ul>
</template>

<script>
	import "./../scss/main.scss";
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			hasLogin(){
				var that = this;
				var isLogin = localStorage.getItem("isLogin");
				if(isLogin == "1"){
					that.$router.push({path:"/user"})
				}else{
					that.$router.push({path:"/login"})
				}
			},
			hasMore(){
				var that = this;
				var isLogin = localStorage.getItem("isLogin");
				if(isLogin == "1"){
					that.$router.push({path:"/more"})
				}else{
					that.$router.push({path:"/login"})
				}
			}
		},
		mounted(){
			
		}
	}
</script>

<style scoped>
	.foor li a i{
			color: #222;
		}
	
.router-link-exact-active.router-link-active{
		color:#f66;
	}
	
		.iconfont{
			font-size: 20px;
			font-style: inherit;
		}
		
</style>