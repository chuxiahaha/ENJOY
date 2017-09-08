<template>
	<div class="cartcontent">
	<div class="cartpro" v-for = "(it,index) in prolist">
		<div class="checkes">
				<input type="checkbox" @click="check(index)" :checked="money[index].s"/> 
			</div>
			<img  :src=it.pic>
			<div class="cartright">
				<div>{{it.name1}}</div>
				<div>单价：{{it.price1/100}}</div>
				<div>
					<span class="tocountreduce" @click = "tocountreduce(it,index)">-</span>
					<span  class ="count" ref="count">{{it.num}}</span>
					<span class="tocountadd" @click = "tocountadd(it,index)">+</span>
					<span class = "todel" @click = "todel(index)">移除</span>
				</div>
			</div>
		</div>
			<div class="caiLike">
		<h1>猜你喜欢</h1>	
			<div v-for="item in datalist" class="likeList">
				<img v-bind:src=item.product_image>
				<p>{{item.short_name}}</p>
				<p class="pricess">
					{{item.price/100}}元
					<span>{{item.storage_state}}</span>
					/{{item.show_entity_name}}
				</p>
			</div>
	
	</div>	
		<div class="cartfooters">
			<div class="foochex">
				<input type="checkbox" @click="checkedAll()" v-model="checkAll"/>
			</div>
			<div class="point">
				全选
			</div>
			<div class="totalyun">
				合计:				
				<span  class="allMony">
					{{totalMoney}}元						
				</span>				
			</div>
			<div class="zhifu" @click="zhifu">
				去结算
			</div>
		</div>	
	</div>
</template>

<script>
	import MyAjax from "./../md/MyAjax.js";
	import "./../scss/cart.scss";
	import router from "./../router/router.js";
	export default{
		data(){
			return{
				prolist:[],
				datalist:[],
				money : [],
				totalMoney:0,
				checkAll : false
			}
		},
		methods:{
			countMoney(){
				this.totalMoney = 0;
				for(let i=0; i < this.money.length; i++){
					if(this.money[i].s){
						this.totalMoney += this.money[i].m;
						console.log(this.totalMoney)
					}
				}
			},
			check(index){
					var num = 0;
				if(this.money[index].s == false){
					this.money[index].s = true;
				}else{
					this.money[index].s = false
				}
				for(let i = 0; i < this.money.length; i++){
					if(this.money[i].s){
						num++
					}
				}
				console.log(num,this.money.length)
				if(num==this.money.length){
					console.log("true")
					this.checkAll = true;
				}else{
					this.checkAll = false;
				}
				this.countMoney();
			},
			checkedAll(){
				if(this.checkAll){
					this.checkAll = false;
				}else{
					this.checkAll = true;
				}
				for(let i = 0; i < this.money.length; i++){
					this.money[i].s = this.checkAll;
				}
				this.countMoney();
			},
			tocountreduce(item,index){
				var proList=this.prolist;	
				var num = proList[index].num;				
				if(num > 1){
					num--;
					proList[index].num=num;
					var goods=JSON.parse(localStorage.getItem("goods"));
					goods[index].num=num;
					localStorage.setItem("goods",JSON.stringify(goods));
					this.money[index].m = item.num*item.price1/100;
					this.countMoney();
				}
				
			},
			tocountadd(item,index){
				var proList=this.prolist;
				var num=proList[index].num;
				num++;
				proList[index].num=num;
				var goods=JSON.parse(localStorage.getItem("goods"));
				goods[index].num=num;
				localStorage.setItem("goods",JSON.stringify(goods));
				this.proList=proList;
				console.log(item,index)
				this.money[index].m = item.num*item.price1/100;
				this.countMoney();
			},
		todel(index){
			console.log(index)
				var proList=this.prolist;
				proList.splice(index,1);
				this.proList=proList;
				var goods=JSON.parse(localStorage.getItem("goods"));
				if(goods==1){
					localStorage.removeItem("goods");					
				}else{
					goods.splice(index,1);
					localStorage.setItem("goods",JSON.stringify(goods))
				}
//				this.money[index].m = item.num*item.price1/100;
				this.countMoney();
		},
			zhifu(){
				/*if(){
					
				}else{
					
				}
				*/
				
				this.$router.push("/buy")
			}
		},
		mounted(){
			var that = this;
			that.prolist = JSON.parse(localStorage.getItem("goods"));	
			for(var i in that.prolist){
				var num = that.prolist[i].num;
				var price = that.prolist[i].price1;
				that.money[i] = {
					s:false,
					m:num*price/100
				}
			}
			
			var url="https://api.ricebook.com/3/enjoy_product/cart_recommend_product.json?city_id=1";
			MyAjax.vueJson(url,function(data){
				that.datalist=data.content;
				
			},function(err){
				console.log(err)
			});			
		},
		
	}
</script>


<style scoped>
	.cartcontent{
		width: 90%;
		height: 100%;
		padding: 5%;
	}
	.cartpro{
		width: 100%;
		height: 150px;
		position: relative;
	}
	.checkes{
		display: block;
		position: absolute;
		left: 0;
		top: 18%;
	}
	.cartpro img{
		margin-left: 10%;
		display: block;
		float: left;
		width: 28%;
		height: 85px;
		margin-right: 10%;
		position: relative;
		
	}

	.cartright{
		width: 50%;
		height: 130px;
		float: left;
	}
	.cartright div:nth-of-type(1){
		width: 100%;
		font-size: 12px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	.cartright div:nth-of-type(2){
		width: 100%;
		font-size: 12px;
		color: #f00;
		line-height: 30px;
		
	}
	.cartright div:nth-of-type(3){
		width: 100%;
		font-size: 12px;
		color: #f66;
	}
	.tocountreduce{
		width: 15%;
		height: 30px;
		display: inline-block;
		background-color: #eee;
		text-align: center;
		line-height: 30px;
	}
	.count{
		width: 15%;
		height: 30px;
		display: inline-block;
		text-align: center;
		line-height: 30px;
		color: #f66;
	}
	.tocountadd{
		width: 15%;
		height: 30px;
		display: inline-block;
		background-color: #eee;
		text-align: center;
		line-height: 30px;
		margin-right: 10%;
	}
	.todel{
		width: 20%;
		height: 30px;
		display: inline-block;
		text-align: center;
		line-height: 30px;
		color: #ccc;
		font-size: 12px;
	}
	
	
</style>