
import store from "../store";

const metaExtend = {
    "ch_name_zh-hans": "HSC NFT",
    "ch_name_en": "HSC NFT NFT",
    "ch_name_ko": "HSC NFT",
};
let lang = store.state.language.localeLang || 'en';
let keyName = `ch_name_${lang}`;
let titleLang = metaExtend[keyName];

const mobileRouterArr = [{
    name: 'Layout',
    path: '/',
    component: () => import(/* webpackChunkName: "mobile-group-layout" */ '../components/Layout.vue'),
    redirect: { name: "Home" },
    children: [{
        name: 'Home',
        path: 'home',
        component: () => import(/* webpackChunkName: "mobile-group-home" */ '../views/mobile/Home.vue'),
    }, {
        name: 'Scenes',
        path: 'scenes',
        component: () => import(/* webpackChunkName: "mobile-group-home" */ '../views/mobile/Scenes.vue'),
    }, {
        name: 'My',
        path: 'my',
        component: () => import(/* webpackChunkName: "mobile-group-home" */ '../views/mobile/My.vue'),
    }],
    meta: {
        title: titleLang,
    },
}];

// console.log(userAgentGlobal);
const routerArr = mobileRouterArr;
// console.log(routerArr);
export default routerArr;