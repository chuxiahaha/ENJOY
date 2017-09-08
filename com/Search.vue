<template>
	<div class="homecontent">
	<div class="sort">
		<span @click = "choosesort1()">本地服务</span>
		<span @click = "choosesort2()">全国送</span>
	</div>

	<div class="sorttitile">根据您的关键词<span></span>为您推荐以下商品</div>
	<div class="homecon">
		<div class="mdpro" v-for="item in products" @click = "godetail(item.product_id)">
			<img :src = item.product_image>
			<div class="right">
				<div class="mdname">{{item.name}}</div>
				<div class="mdpr"><span class="mdprice">￥{{item.price/100}}元</span><span class="wei">/{{item.show_entity_name}}</span></div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import "./../scss/main.scss";
	import router from "./../router/router.js";
	import MyAjax from "./../md/MyAjax.js";
	export default{
		data(){
			return{
				products:[],
				arr:[]
			}
		},
		methods:{
			choosesort1(){
				var that = this;
				var keyword = that.$route.query.keyword;
				var cityID = localStorage.getItem("id");
				var url1 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id="+cityID+"&keyword="+keyword+"&page=0";
				MyAjax.vueJson(url1,function(data){
					 that.products = data.products; 
				},function(err){
					console.log(err)
				})
			},
			choosesort2(){
				var that = this;
				var keyword = that.$route.query.keyword;
				var url2 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id=1&keyword="+keyword+"&page=0";
				MyAjax.vueJson(url2,function(data){
					 that.products = data.products; 
				},function(err){
					console.log(err)
				})
			},
			godetail(data){
		
				var that = this;
				that.$router.push({path:'/detail',query:{allid:data}});
			}
		},
		mounted(){
			var that = this;
			var keyword = that.$route.query.keyword;
			var cityID = localStorage.getItem("id");
				var url1 = "https://api.ricebook.com/3/enjoy_product/search.json?city_id="+cityID+"&keyword="+keyword+"&page=0";
				MyAjax.vueJson(url1,function(data){
					console.log(data)
					 that.products = data.products; 
	
				},function(err){
					console.log(err)
				})
		}
	}
</script>

<style scoped>
	.homecontent{
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.homecontent::-webkit-scrollbar {display: none;}
	.sort{
		width: 100%;
		height: 50px;
	}
	.sort span{
		width: 50%;
		display: inline-block;
		line-height: 50px;
		text-align: center;
		float: left;
		font-size: 16px;
		box-sizing: border-box;
		border-right: 1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}
	 .iconfont{
		font-style: inherit;
	}
	.sorttitile{
		width: 100%;
		height: 20px;
		color: #ccc;
		text-align: center;
		font-size: 15px;
		color: #666;
	}
	.homecon{
		width: 90%;
		padding: 5%;
		height: 90%;
	}
	.mdpro{
		width: 100%;
		height: 100px;
		padding: 4% 0;
		border-bottom: 1px solid #ccc;
	}
	.mdpro img{
		display: block;
		width: 40%;
		height: 100px;
		float: left;
		margin-right: 10%;
	}
	.right{
		width: 50%;
		height: 100px;
		float: left;
		font-size: 12px;
	}
	.mdname{
		width: 100%;
		line-height: 20px;
		margin-bottom: 20px;
	}
	.mdpr{
		width: 100%;
		line-height: 20px;
		color: #f66;
	}
	.originprice{
		width: 20%;
		margin-left: 20px;
		color: #ccc;
	}
</style>