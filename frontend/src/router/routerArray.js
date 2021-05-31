
import store from "../store";

const metaExtend = {
    "ch_name_zh-hans": "HSC盲盒活动",
    "ch_name_en": "HSC NFT Box Campaign",
    "ch_name_ko": "HSC 랜덤 박스 이벤트",
};
let lang = store.state.language.localeLang || 'en';
let keyName = `ch_name_${lang}`;
let titleLang = metaExtend[keyName];

const pcRouterArr = [{
    name: 'Home',
    path: '/',
    component: () => import(/* webpackChunkName: "pc-group-home" */ '../views/pc/Home.vue'),
    meta: {
        title: titleLang,
    },
}, {
    name: 'OpenResult',
    path: '/open/:id?',
    component: () => import(/* webpackChunkName: "pc-group-open" */ '../views/pc/OpenResult.vue'),
    meta: {
        title: titleLang,
    },
}, {
    name: 'ReceiveResult',
    path: '/receive/:id?',
    component: () => import(/* webpackChunkName: "pc-group-receive" */ '../views/pc/ReceiveResult.vue'),
    meta: {
        title: titleLang,
    },
}];
const mobileRouterArr = [{
    name: 'Home',
    path: '/',
    component: () => import(/* webpackChunkName: "mobile-group-home" */ '../views/mobile/Home.vue'),
    meta: {
        title: titleLang,
    },
}, {
    name: 'OpenResult',
    path: '/open/:id?',
    component: () => import(/* webpackChunkName: "mobile-group-open" */ '../views/mobile/OpenResult.vue'),
    meta: {
        title: titleLang,
    },
}, {
    name: 'ReceiveResult',
    path: '/receive/:id?',
    component: () => import(/* webpackChunkName: "mobile-group-receive" */ '../views/mobile/ReceiveResult.vue'),
    meta: {
        title: titleLang,
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