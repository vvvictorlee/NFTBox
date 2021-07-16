import * as types from '../mutation-types'

/* 通用配置 */
const state = {
    ajaxTokens:[],
}

const getters = {
    getAjaxTokens: state => state.ajaxTokens,
}

const actions = {
    setAjaxTokens({ commit }, status) {
        commit(types.SET_TOKEN, status)
    },
}

const mutations = {
    [types.SET_TOKEN](state, status) {
        if(status == 'clear'){
            state.ajaxTokens = [];
        }else{
            state.ajaxTokens = [...state.ajaxTokens,status]
        }
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}