import * as types from '../mutation-types'

/* 通用配置 */
const state = {
    nft: '',
    openMessage: {
        level: '',
        last_times: '0',
    },
    myboxList: [],
    openBoxInfo: {
        name: '',
        level: '',
        tokens: [],
    },
    //登陆的hsc链上地址
    hscAddress: '',
}
const getters = {
    getNft: state => state.nft,
    getOpenMessage: state => state.openMessage,
    getMyboxList: state => state.myboxList,
    getOpenBoxInfo: state => state.openBoxInfo,
    getHscAddress: state => state.hscAddress,
}

const actions = {
    setNft({ commit }, status) {
        commit(types.NFT, status)
    },
    setOpenMessage({ commit }, status) {
        commit(types.OPEN_MESSAGE, status)
    },
    setMyboxList({ commit }, status) {
        commit(types.MY_OPEN_BOX, status)
    },
    setOpenBoxInfo({ commit }, status) {
        commit(types.OPEN_BOX_INFO, status)
    },
    setHscAddress({commit},status){
        commit(types.HSC_ADDRESS, status)
    },
}

const mutations = {
    [types.NFT](state, status) {
        state.nft = status;
    },
    [types.OPEN_MESSAGE](state, status) {
        state.openMessage = Object.assign({},state.openMessage,status);
    },
    [types.MY_OPEN_BOX](state, status) {
        // console.log(status);
        state.myboxList = status;
    },
    [types.OPEN_BOX_INFO](state, status) {
        state.openBoxInfo = Object.assign({},state.openBoxInfo,status);
    },
    [types.HSC_ADDRESS](state, status) {
        state.hscAddress = status;
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}