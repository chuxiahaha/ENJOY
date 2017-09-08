import Home from "./../com/Home.vue";
import Kind from "./../com/Kind.vue";
import User from "./../com/User.vue";
import More from "./../com/More.vue";
import Cart from "./../com/Cart.vue";

import HomeHeader from "./../com/HomeHeader.vue";
import KindHeader from "./../com/KindHeader.vue";
import UserHeader from "./../com/UserHeader.vue";
import MoreHeader from "./../com/MoreHeader.vue";
import MainFooter from "./../com/MainFooter.vue";
import ProChoose from "./../com/MapChoose.vue";
import BuyHeader from "./../com/BuyHeader.vue";
import Login from "./../com/Login.vue";
import Detail from "./../com/Detail.vue";
import CartHeader from './../com/CartHeader.vue';
import LoginHeader from "./../com/LoginHeader.vue";
import MapNewDetail from "./../com/MapNewDetail.vue";
import Search from "./../com/Search.vue";
import Buy from "./../com/Buy.vue"
import MapDetail from "./../com/MapDetail.vue";
const routes = [
	{path:"/",redirect:"/home"},
	{path:"/home",components:{
		default:Home,
		header:HomeHeader,
		footer:MainFooter
	}},
	{path:"/home/:cityid",name:'home',components:{
		default:Home,
		header:HomeHeader,
		footer:MainFooter
	}},
	{path:"/kind",components:{
		default:Kind,
		header:KindHeader,
		footer:MainFooter
	
	}},
	{path:"/user",components:{
		default:User,
		header:UserHeader,
		footer:MainFooter
	}},
	{path:"/prochoose",components:{
		default:ProChoose,
		header:KindHeader,
		footer:MainFooter
	}},
	{path:"/login",components:{
		default:Login,
		header:LoginHeader,
		footer:MainFooter
	}},
	{path:"/detail",components:{
		default:Detail,
		header:KindHeader,
	}},
	{path:"/mapdetail",components:{
		default:MapDetail,
		header:KindHeader,
		footer:MainFooter
	}},
	{path:"/mapnewdetail",components:{
		default:MapNewDetail,
		header:KindHeader
	}},
	{path:"/search",components:{
		default:Search,
		header:KindHeader,
		footer:MainFooter
	}},
	{path:"/cart",components:{
		default:Cart,
		header:CartHeader,
		footer:MainFooter
		
	}},
	{path:"/more",components:{
		default:More,
		header:MoreHeader,
		footer:MainFooter
		
	}},
	{path:"/buy",components:{
		default:Buy,
		header:BuyHeader,
	}},
]

export default routes;
