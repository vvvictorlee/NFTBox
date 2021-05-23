import Vue from 'vue';
import App from './App.vue';
import router from "./router/index";
import Store from "./store/index";
import VueWechatTitle from "vue-wechat-title";
import VueI18n from 'vue-i18n';
// import 'lib-flexible'; // 对应设置根的字体
import Vant from 'vant';
import 'vant/lib/index.css';
import { Swipe, SwipeItem,Lazyload,Overlay,Field,Empty,Toast} from 'vant';
import { Image as VanImage } from 'vant';
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Overlay);
Vue.use(VanImage);
Vue.use(Field);
Vue.use(Empty);
Vue.use(Toast);

require('./utils/px2rem');
import '../public/sass/reset.scss';


Vue.prototype.$store = Store;
Vue.prototype.$Toast = Toast;
Vue.use(VueWechatTitle);
Vue.use(Vant);
Vue.use(VueI18n);
import i18nMsg from "./i18n/index";
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
    lazyComponent: true,
});

//语言国际化
const i18n = new VueI18n({
	locale: Store.state.language.locale || "zh-hans", // 语言标识
	messages: {
		"zh-hans": i18nMsg["zh-hans"], // 中文语言包
		"en": i18nMsg["en"], // 英文语言包
		"ko": i18nMsg["ko"], // 韩文语言包
	},
	silentTranslationWarn: true,
});

Vue.config.productionTip = false

new Vue({
    router,
    i18n,
    render: h => h(App),
}).$mount('#app')
