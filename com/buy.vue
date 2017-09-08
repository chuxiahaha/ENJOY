<template>
	<div class="buyHeader">
		<p>本地精选</p>
	<div class="content">
		<ul>
			<li v-for="item in list" class="shpi">
				<b>{{item.description1}}</b>
				<h4>
					<i>{{item.price1/100}}元</i>	
					X<i>{{item.num}}</i>
				</h4>			
				<div class="detail">{{item.spec1}}</div>			
			</li>			
		</ul>		
	</div>	
	<div class="kong"></div>
		<div class="quan">
			<div class="top">
				<span></span>
				<i>礼券</i>
				<h2>暂无礼券可用</h2>
			</div>
		<div class="downs">
			<input type="text" id="txt">
			<input type="button" value="兑换" id="btn">	
		</div>				
	</div>
	<div class="kong"></div>
	<div class="sptotals">
		<h1>商品金额</h1>
		<span class="zongjia"> <strong class="yuan">0</strong>元</span>		
	</div>	
		
		
<div class="buyfooter">
	<div class="heji">
		<div class="left">
		<i class="hj">合计:</i>
		<h3 class="money">0</h3>
		<span>元</span>
	</div>
	</div>
	<div class="zhifu">
		去支付
	</div>
</div>		
		
	</div>
</template>

<script>
	export default {
		data(){
			return {
				list:[]
			}
		},
		mounted(){
			var that=this;
			var goods=localStorage.getItem("goods");			
			that.list=eval(goods);
			var pri="";
			var Num="";
			var aa=0;
			for(var i in that.list){
				pri=that.list[i].price1/100;
				Num=that.list[i].num;
				aa+=pri*Num;
			};
			$(".yuan").html(aa);
			$(".money").html(aa);
		}
	}
</script>
</script>

<style scoped>
	
	.buyHeader p{
		width: 92%;
		padding: 2%;
		line-height: 1.5rem;		
		font-size: 12px;
		border-bottom: 1px solid #ccc;
		margin-left: 2%;
	}
	.content{
		width: 100%;
		border-bottom:1px solid #ccc ;
	}
	.shpi{
		margin-left:2%;	
		height: 3rem;
		position: relative;	
		
	}
	.shpi b{
		width: 75%;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		font-weight: 100;
		font-size: 14px;
		line-height: 26px;
		float: left
		
	}
	.shpi h4{
		
		font-size: 12px;
		position: absolute;
		top: 4px;
		right: 12px;
	}
	.shpi h4 i{
			font-style: inherit;
	}
	.detail{
		font-weight: 100;
		font-size: 12px;
		display: block;
		float: left;
		position: absolute;
		top: 25px;
		
	}
	.kong{
		width: 100%;
		height: 8px;
		background: #eee;		
	}
	.quan{
		width: 100%;
		height: 6rem;
		border: 1px solid #ccc;	
		box-sizing: border-box;
	}
	.top{
		width: 90%;
		font-size: 12px;
		padding: 3% 0;	
		height: 1.3rem;
	
	}
	.top span{
		width: 1rem;
		height: 1rem;
		display: block;
		border-radius: 50%;
		margin-left:3%;
		background: #f66;
		float: left;
	
	}
	.top i{
		font-style: inherit;
	
		color: #444;
		float: left;
		margin-left: 1%;
	}
	.top h2{
		font-weight: 100;
		float: right;
		color: #ccc;
		margin-right: 3%;
	}
	.downs{
		width: 96%;
		padding: 2% 0;
		height: 2rem;
		
	}
	#txt{
		width: 70%;
		height: 30px;
		outline: none;
		margin-left: 2%;
		box-sizing: border-box;
		text-indent: 3%;
	}
	#btn{
		outline: none;
		background: #f00;
		color: #fff;
		border: none;
		width: 20%;
		height: 30px;
		box-sizing: border-box;
		font-size: 12px;
	}
	.sptotals{
		width: 100%;
		padding: 4% 0;
		height: 1.0rem;
		border-bottom: 1px solid #ccc;
		font-size: 12px;
	}
	.sptotals h1{
		font-weight: 100;
		margin-left: 2%;
		float: left;
	}
	.zongjia{
	float: right;
	margin-right: 4%;		
	}
	.zongjia strong{
		font-weight: 100;
	}
	.buyfooter{
		width: 100%;
		height: 50px;
		position: fixed;
		bottom: 0;
		left: 0;
		
	}
	.heji{
		width: 70%;
		line-height: 50px;
		font-size: 14px;
		color: #f00;
		float: left;
	}
	.money{
		float: left;
		font-weight: 100;
		font-style: inherit;
		margin-left: 3%;
		
	}
	.hj{
		float: left;
		margin-left:58%;
		font-style: inherit;
	}
	.left{
		text-align: right;
	}
	
	.zhifu{
		width: 30%;
		color: #fff;
		height: 50px;
		line-height: 50px;
		background: #f00;
		float: left;
		text-align: center;
	}
</style>