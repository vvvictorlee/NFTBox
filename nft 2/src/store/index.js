import Vue from "vue";
import Vuex from "vuex";
import nft from './modules/nft';
import common from './modules/common';
import language from './modules/language';
import VuexPersistence from "vuex-persist";
const vuexLocal = new VuexPersistence({
	storage: window.sessionStorage,
	modules: ["language","common",'nft'],
});

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        language,
        nft,
        common,
    },
    plugins: [vuexLocal.plugin],
});