import Vue from "vue";
import Router from "vue-router";
import routerArr from './routerArray';

Vue.use(Router);

let router = new Router({
    mode: "hash",
    scrollBehavior(to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			return {
				x: 0,
				y: 0,
			};
		}
	},
    routes: routerArr,
});

export default router;