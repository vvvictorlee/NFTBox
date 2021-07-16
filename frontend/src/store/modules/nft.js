import * as types from '../mutation-types'

/* 通用配置 */
const state = {
    clientAccount: '',
}
const getters = {
    getClientAccount: state => state.clientAccount,
}

const actions = {
    setClientAccount({ commit }, status) {
        commit(types.CLIENT_ACCOUNT, status)
    },
}
const mutations = {
    [types.CLIENT_ACCOUNT](state, status) {
        state.clientAccount = status;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}