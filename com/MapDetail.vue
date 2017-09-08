<template>
<div class="homecontent">
	<div class="sort">
		<span>全部</span>
		<span @click = "choosesort()" >智能排序<i class="iconfont">&#xe643;</i></span>
	</div>
	<div class="intelligent">
		<p v-for = "item in data1" @click = gosort(item)>{{item.sort_name}}</p>
	</div>
	<div class="homecon">
		<div class="mdpro" v-for="item in data2" @click = gomapnewdetail(att)>
			<img :src=item.product_image >
			<div class="right">
				<div class="mdname">{{item.name}}</div>
				<div class="mdpr"><span class="mdprice">￥{{item.price/100}}</span><span class="wei">/{{item.show_entity_name}}</span><span class="originprice">￥{{item.original_price/100}}</span></div>
				<div class="mdarea">{{item.area}}</div>
			</div>
		</div>
	</div>
</div>
</template>

<script>
	import MyAjax from "./../md/MyAjax.js";
	import "./../scss/main.scss";
	import router from "./../router/router.js"; 
	export default{
		data(){
			return{
				data1:[],
				data2:[],
				proID:[],
				sortID:1,
				att:'',
				
				
			}
		},
		methods:{
			gomapnewdetail(data3){
				var that = this;
				that.$router.push({path:"/mapnewdetail",query:{proID:data3}})
			},
			choosesort(){
				$(".intelligent").find("p").css("display","block");				
			},
			gosort(data4){
				var that = this;
				var sortID = data4.sort_id;
				var categoryID = that.$route.query.categoryID;
				var cityID = localStorage.getItem("id");
				$(".intelligent").find("p").css("display","none");
				var url2 = "https://api.ricebook.com/4/tab/category_product_list.json?category_id="+categoryID+"&sort="+sortID+"&from_id=0&city_id="+cityID+"&page=0";
				MyAjax.vueJson(url2,function(data){
				that.data2 = data;
				for(var i in that.data2){
					that.att=that.data2[i].product_id;
				}
				 
			},function(err){
				console.log(err)
			});				
			}
		},
		mounted(){
			var that = this;
			var categoryID = that.$route.query.categoryID;
			var cityID = localStorage.getItem("id");
			var sortID = that.sortID;
			var url1 = "https://api.ricebook.com/4/tab/sub_category.json?category_id="+categoryID+"&city_id="+cityID+"&from_id=0";
			var url2 = "https://api.ricebook.com/4/tab/category_product_list.json?category_id="+categoryID+"&sort="+sortID+"&from_id=0&city_id="+cityID+"&page=0"
			MyAjax.vueJson(url1,function(data){
					that.data1 = data.sort;
				},function(err){
					console.log(err)
				});
			MyAjax.vueJson(url2,function(data){
				that.data2 = data;
				for(var i in that.data2){
					that.att=that.data2[i].product_id;
				}
				 
			},function(err){
				console.log(err)
			});
			
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
	.intelligent{
		font-size: 12px;
	}
	.intelligent p{
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		text-align: center;
		border-bottom: 1px solid #ccc;
		display: none;
		color: #f66;
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
		height: 120px;
		float: left;
		font-size:12px;
		
	}
	.mdname{
		width: 100%;
		font-size: 14px;
		line-height: 15px;
		margin-bottom: 20px;
	}
	.mdpr{
		width: 100%;
		
		color: #f66;
	}
	.mdarea{
	border-bottom: 5px;
	padding:2% 0 ;
	
		
	}
	.originprice{
		width: 20%;
		margin-left: 20px;
		color: #ccc;
		text-decoration: line-through;
	}
	#footer{
		height: 0;
		
	}
</style>