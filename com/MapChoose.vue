<template>
	<div class="homecontent">
		<ul class="chosul" >
			<div class="chostitle">{{map1[0].name}}</div>
			<li v-for = "item in list1" @click="goMapDtail1(item.enjoy_url)">{{item.name}}</li>
		</ul>
		<ul class="chosul" >
			<div class="chostitle">{{map1[1].name}}</div>
			<li v-for = "item in list2" @click="goMapDtail2(item.enjoy_url)">{{item.name}}</li>
		</ul>
		<ul class="chosul" >
			<div class="chostitle">{{map1[2].name}}</div>
			<li v-for = "item in list3" @click="goMapDtail3(item.enjoy_url)">{{item.name}}</li>
		</ul>
		<ul class="chosul" >
			<div class="chostitle">{{map1[3].name}}</div>
			<li v-for = "item in list4" @click="goMapDtail4(item.enjoy_url)">{{item.name}}</li>
		</ul>
	</div>
</template>

<script>
	import "./../scss/main.scss";
	import router from "./../router/router.js";
	import MyAjax from "./../md/MyAjax.js";	
	export default{
		data(){
			return{
				map1:[],
				mapList:[],
				list:[],
				list1:[],
				list2:[],
				list3:[],
				list4:[],
				category:'',
				detail1:[]
			}
		},
		
		mounted(){
				var that = this;
				var url = "https://s1.ricebook.com/cdn/home/djEvdmlydHVhbC9pbl9jYXRlZ29yeS5qc29uP2NpdHlfaWQ9MTA0JmlzX25ld19sb2NhbD1mYWxzZSZtZDU9NmNkMzg2ZWZmY2Y0NjVjYmRiNWY1ZGQzZDQxZTc1NjcmMjAxNzA4MTkyMTAw.json";
				MyAjax.vueJson(url,function(data){
		
					that.map1 = data;
					var list=[];
					var detail=[];
					var detail1=[];
					var detail2=[];
					var detail3=[];
					var detail4=[];
					var arr1=[];
					var arr2=[];
					var arr3=[];
					var arr4=[];					
					for(var i in data){
						 list.push(data[i].sub_category_list);						 
					}

					that.list1 = list[0],
					that.list2 = list[1],
					that.list3 = list[2],
					that.list4 = list[3]			
				},function(err){
					console.log(err)
				})								
			},
			methods:{
			goMapDtail1(data){
				var that = this;
				that.category = data.split("&",1).toString().slice(40);
				that.$router.push({path:"/mapdetail",query:{categoryID:that.category}})
				localStorage.setItem("categoryID",that.category);
			},
			goMapDtail2(data){
				var that = this;
				that.category = data.split("&",1).toString().slice(40);
				localStorage.setItem("categoryID",that.category);
			},
			goMapDtail3(data){
				var that = this;
				that.category = data.split("&",1).toString().slice(40);
				localStorage.setItem("categoryID",that.category);
			},
			goMapDtail4(data){
				var that = this;
				that.category = data.split("&",1).toString().slice(40);
				localStorage.setItem("categoryID",that.category);
			}
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
	.chosul{
		width: 100%;
		
	}
	.chostitle{
		width: 95%;
		padding-left: 5%;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		background-color: #ccc;
		clear: both;
	}
	.chosul li {
		font-size: 12px;
		box-sizing: border-box;
		text-align: center;
		height: 40px;
		line-height: 40px;
		float: left;
		width: 33.3%;
		border-right:1px solid #ccc;
		border-bottom: 1px solid #ccc;
	}
	
</style>