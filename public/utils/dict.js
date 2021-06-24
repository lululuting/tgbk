/*
 * @Author: TingGe
 * @Date: 2021-05-26 14:14:18
 * @LastEditTime: 2021-05-27 14:51:48
 * @LastEditors: TingGe
 * @Description: 字典 懂的都懂
 * @FilePath: /ting_ge_blog/public/utils/dict.js
 */
import _ from 'lodash';

/**
 * @description: 编译字典
 * @param { path, value isRe}
 * @return { result } 
 */
export const filtersDict = (path, value, isRe) => {
    const strKey = "___"; // 约定字典变量 为 ___ 开头；
    const dictObj = _.get(DICT, path, []);
    let result;
    
    for (const [k, v] of _.entries(dictObj)) {
        if(v === value){
            if(isRe){
                result = dictObj[`${strKey}${k}`];
            }else{
                result = dictObj[k.replace(strKey, "")];
            }
        }
    }
    return result;
}


// /**
//  * @description: 反编译字典
//  * @param { path, value }
//  * @return { result } 
//  */
//  export const reverseFiltersDict = (path, value) => {
//     const strKey = "___"; // 约定字典变量 为 ___ 开头；
//     const dictObj = _.get(DICT, path, []);
//     let result;
    
//     for (const [k, v] of _.entries(dictObj)) {
//         if(v === value){
//             result = dictObj[k.replace(strKey, "")];
//         }
//     }
//     return result;
// }



export const DICT = {
    SEARCH_TYPE: {
        ARTICLE: 0,
        USER: 1,
        ___ARTICLE: 'article',
        ___USER: 'user'
    },
}
