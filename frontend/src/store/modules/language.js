import * as types from '../mutation-types';

const state = {
    localeLang: 'zh-hans',
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
    },
}
export default {
    state,
    actions,
    getters,
    mutations
}