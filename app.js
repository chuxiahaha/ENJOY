import Vue from "vue";
import VueRouter from "vue-router";
import VueResource from "vue-resource";
Vue.use(VueRouter);
Vue.use(VueResource);

import "./scss/main.scss";
import App from "./com/App.vue";
import router from "./router/router.js";

new Vue({
	el:"#app",
	router:router,
	data:{
		
	},
	methods:{
		
	},
	components:{
		"v-app":App
	},
	computed:{
		
	},
	watch:{
		
	},
	mounted(){
		
	}
})
