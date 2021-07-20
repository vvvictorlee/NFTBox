/*
 * localStorage 
 * @Date: 2020-05-07 11:31:36 
 * @Last Modified time: 2020-05-07 16:56:42
 * 
*/
const localStorage = window.localStorage;
export const getLocalStorage = (key) => {
    let value = localStorage.getItem(key) || "";
    if (value.startsWith('[') || value.includes('{')) {
        return JSON.parse(value);
    } else {
        return value
    }
}

export const setLocalStorage = (key,value) => {
    if(typeof value == 'object'){
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value);
}