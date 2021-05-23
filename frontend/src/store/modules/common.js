import * as types from '../mutation-types'
import { getBanners } from '../../http/home';
import {bannerConfig} from '../../views/config/index';
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
        getBanners().then(res => {
            console.log(res);
            if (res.code == '10000') {
                let records = res.data && res.data.records || [];
                let len = records.length;
                if (len > 0) {
                    records.forEach((element, index) => {
                        let level = element.level || '';
                        // console.log(level);
                        if (!!level) {
                            let findItem = bannerConfig[level] || {};
                            let tempObj = Object.assign({}, element, findItem);
                            // console.log(tempObj);
                            records.splice(index, 1, tempObj);
                        }
                    });
                }
                commit(types.BANNER_LIST, records)
            }
        });
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