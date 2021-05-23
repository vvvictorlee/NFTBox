import * as config from './apiConfig';
import httpRequest from '../axios/httpRequest';

export const getBanners = (params = {}) => {
    return httpRequest.get(config.getBanners,params);
}

export const handleReceive = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "claimbox",
        params: params,
    };
    return httpRequest.post(config.handleReceive,requestParams);
}

export const getMyboxes = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "myboxes",
        params: params,
    };
    return httpRequest.post(config.getMyboxs,requestParams);
}

export const openBox = (params = {}) => {
    let requestParams = {
        jsonrpc: "2.0",
        id: "id",
        method: "openbox",
        params: params,
    };
    return httpRequest.post(config.openBox,requestParams);
}