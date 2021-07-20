import * as types from '../mutation-types';

const state = {
    localeLang: 'en', //zh-hans , en, ko
}
const actions = {
    //更换语种
    setLocaleLang({ commit }, status) {
        commit(types.LOCALE_LANG, status)
    },
}
const getters = {
    getLocaleLang: state => state.localeLang,
}
const mutations = {
    //记录当前语言
    [types.LOCALE_LANG](state, status) {
        state.localeLang = status;
        window.location.reload();
    },
}
export default {
    state,
    actions,
    getters,
    mutations
}