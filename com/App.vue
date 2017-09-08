<template>
	<div class="container">
		<header class="header">
			<router-view name="header"></router-view>
		</header>
		<div id="content">
			<router-view></router-view>
		</div>
		<footer class="footer" id="footer">
			<router-view name="footer"></router-view>
		</footer>
	</div>
</template>

<script>

	import MainFooter from "./MainFooter.vue";
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			
		},
		components:{
			"v-footer":MainFooter
		}
		
	}
</script>

<style >
	
</style>
