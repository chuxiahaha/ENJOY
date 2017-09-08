<template>
	<div class="usercontent">
		<img  src="../img/user.jpg"/>
		<div class = "usercon">
			<div class="description">邀请好友加入ENJOY，给TA发放价值50元礼券。好友完成首单消费后，你亦可获得价值50元礼券。</div>
			<input type="submit" name="" id="submit" value="即刻邀请" />
			<div class="success">已成功邀请了<span>0</span>位好友|获得<span>0</span>元礼券</div>
			<div class="kong"></div>
			<div class="num">
				<span>1</span>
				<span>5</span>
				<span>10</span>
				<span>25</span>
				<span>50</span>
			</div>
			<ul class="man1">
				<li><span>5人</span><span>额外奖励</span><span>100元</span></li>
				<li><span>10人</span><span>额外奖励</span><span>100元</span></li>
				<li><span>25人</span><span>额外奖励</span><span>750元</span></li>
				<li><span>50人</span><span>额外奖励</span><span>2000元</span></li>
			</ul>
			<div class="detail">奖励明细</div>
		</div>
	</div>
</template>

<script>
	import "./../scss/main.scss";
	import router from "./../router/router.js";
	import MyAjax from "./../md/MyAjax.js";
	export default {
		data(){
			return {
				
			}
		},
		mounted(){
			var that = this;
			//var url = "https://api.ricebook.com/meereen/v1/invitation_code/detail.json";
		}
	}
</script>

<style scoped>
	.usercontent{
		width: 100%;
		height: 100%;
		
	}
	.usercontent img{
		width: 100%;
		height: 110px;
	}
	.usercon{
		width:90%;
		padding: 5%;
	}
	.description{
		width: 100%;
		font-size: 14px;
		line-height: 20px;
		padding-bottom: 30px;
	}
	#submit{
		width: 30%;
		height: 40px;
		line-height: 40px;
		display: block;
		margin-left: 33%;
		background-color: #f66;
		color: #fff;
		border: none;
		margin-bottom: 30px;
	}
	.success{
		width: 100%;
		text-align: center;
		line-height: 20px;
		margin-bottom: 20px;
	}
	.success span{
		color: red;
	}
	.kong{
		width: 100%;
		height: 20px;
		border: 1px solid #ccc;
		border-radius: 12px;
		margin-bottom: 20px;
		
	}
	.num{
		width: 100%;
		color: #ccc;
		height: 20px;
	}
	.num span:nth-of-type(1){
		width: 5%;
		text-align: center;
		display: inline-block;
	}
	.num span:nth-of-type(2){
		width: 10%;
		text-align: center;
		display: inline-block;
	}
	.num span:nth-of-type(3){
		width: 20%;
		text-align: center;
		display: inline-block;
	}
	.num span:nth-of-type(4){
		width: 25%;
		text-align: center;
		display: inline-block;
	}
	.num span:nth-of-type(5){
		width: 30%;
		text-align: center;
		display: inline-block;
	}
	.man1{
		width: 100%;
		color: #ccc;
	}
	.man1 li{
		width: 100%;
		height: 30px;
		line-height: 30px;
		font-size: 14px;
		color: #555;
	}
	.man1 li span:nth-of-type(1){
		width: 15%;
		display: inline-block;
		text-align: center;
		margin-right: 30%;
	}
	.man1 li span:nth-of-type(2){
		width: 20%;
		display: inline-block;
		text-align: center;
		margin-right: 10%;
	}
	.man1 li span:nth-of-type(3){
		text-align: center;
		display: inline-block;
		width: 20%;
	}
	.detail{
		width: 100%;
		text-align: center;
	}
</style>