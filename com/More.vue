<template>
	<div class="morecontent">
		<div class="img">
			<img src="../img/more.png" />
			<img src="../img/more1.png" />
			<p>ENJOY_XIXIHAHA</p>
		</div>
		<div class="code1"><p>code消费码</p></div>
		<div class="code2"><p>我的礼券</p></div>
		<div class="code3"><p>地址管理</p></div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		}
	}
</script>

<style scoped>
	.morecontent{
		width:100%;
		height: 100%;
	}
	.img{
		width:100%;
		height: 178px;
		position: relative;
	}
	.img img:nth-of-type(1){
		width: 100%;
		height: 178px;
	}
	.img img:nth-of-type(2){
		width: 18%;
		font-size: 30px;
		height: 60px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -10%;
		margin-top: -45px;
	}
	.img p{
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #fff;
		position: absolute;
		top: 50%;
		left: 0;
		margin-top: 50px;
	}
	.code1{
		width: 100%;
		height: 50px;
		line-height: 50px;
		border-top: 10px solid #ccc;
		background-color: #fff;
		border-bottom: 10px solid #ccc;
	
	}
	.code1 p {
		padding-left: 30px;
	}
	.code2{
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
	
	}
	.code2 p {
		padding-left: 30px;
	}
	.code3{
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #fff;
		border-bottom: 1px solid #ccc;
	
	}
	.code3 p {
		padding-left: 30px;
	}
</style>