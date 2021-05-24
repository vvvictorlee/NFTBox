import * as types from '../mutation-types'

/* 通用配置 */
const state = {
    ajaxTokens:[],
    bannersList: [],
}

const getters = {
    getBannerList: state => state.bannersList,
    getAjaxTokens: state => state.ajaxTokens,
}

const actions = {
    setAjaxTokens({ commit }, status) {
        commit(types.SET_TOKEN, status)
    },
    setBannerList({ commit }, status) {
        commit(types.BANNER_LIST, status)
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
    [types.BANNER_LIST](state, status) {
        state.bannersList = status;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}