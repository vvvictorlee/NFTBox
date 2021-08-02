import * as config from './apiConfig';
import httpRequest from '../axios/httpRequest';

//查询是否领取完
export const handleCheck = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "ismaxtotalsupply",
        params: params,
    };
    return httpRequest.post(config.ismaxtotalsupply,requestParams);
}

//领取
export const handleReceive = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "claimbadge",
        params: params,
    };
    return httpRequest.post(config.claimbadge,requestParams);
}
//我的
export const getMyboxes = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "mybadge",
        params: params,
    };
    return httpRequest.post(config.mybadge,requestParams);
}

//极验证
export const getGtParams = (params = {}) => {
    return httpRequest.get(config.gtapi,params);
}
