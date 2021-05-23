
const pcRouterArr = [{
    name: 'Home',
    path: '/',
    component: () => import(/* webpackChunkName: "pc-group-home" */ '../views/pc/Home.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}, {
    name: 'OpenResult',
    path: '/open/:id?',
    component: () => import(/* webpackChunkName: "pc-group-open" */ '../views/pc/OpenResult.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}, {
    name: 'ReceiveResult',
    path: '/receive/:id?',
    component: () => import(/* webpackChunkName: "pc-group-receive" */ '../views/pc/ReceiveResult.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}];
const mobileRouterArr = [{
    name: 'Home',
    path: '/',
    component: () => import(/* webpackChunkName: "mobile-group-home" */ '../views/mobile/Home.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}, {
    name: 'OpenResult',
    path: '/open/:id?',
    component: () => import(/* webpackChunkName: "mobile-group-open" */ '../views/mobile/OpenResult.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}, {
    name: 'ReceiveResult',
    path: '/receive/:id?',
    component: () => import(/* webpackChunkName: "mobile-group-receive" */ '../views/mobile/ReceiveResult.vue'),
    meta: {
        title: 'HSC盲盒活动'
    },
}];

let userAgentGlobal = "";
if (navigator.userAgent.match(/(iPhone|iphone|ipad|ipod|iPad|iPod)/i)) {
    userAgentGlobal = "iphone";
} else if (navigator.userAgent.match(/(Android|android)/i)) {
    userAgentGlobal = "android";
} else {
    userAgentGlobal = "pc";
}
// console.log(userAgentGlobal);
const routerArr = userAgentGlobal == 'pc' ? pcRouterArr : mobileRouterArr;
// console.log(routerArr);
export default routerArr;