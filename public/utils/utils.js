/* 公共类库
 * @Date: 2020-04-04 17:54:05
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-04-04 18:00:17
 * @FilePath: \ting_ge_blog\public\utils\utils.js
 */
import moment from 'moment'
import store from '@/store'
import CryptoJS from 'crypto-js'


/** 国家公祭日置灰
 * @description: 
 * @param {type} 
 * @return: 
 */
export const memorial = () => {
    let now = moment().locale('zh-cn').format('MM-DD');
    if (
        now === '04-04' || // 清明
        now === '05-12' || // 汶川大地震
        now === '12-13' // 南京大屠杀
    ) {
        document.getElementsByTagName('html')[0].style = 'filter: grayscale(100%);'
    }
}


/** 动态加载js脚本
 * @description: 
 * @param {url} string url
 * @param {callback} fun 回调
 * @return: 
 */
export const loadScript = (url, callback) => {
    // 检测是否加载了 js 文件
    const checkIsLoadScript = (src) => {
        let scriptObjs = document.getElementsByTagName('script');
        for (let sObj of scriptObjs) {
            if (sObj.src == src) {
                return true;
            }
        }
        return false;
    }

    if (checkIsLoadScript(url)) {
        callback();
        return false
    }

    let scriptNode = document.createElement("script");
    scriptNode.setAttribute("type", "text/javascript");
    scriptNode.setAttribute("src", url);
    document.body.appendChild(scriptNode);
    if (scriptNode.readyState) { //IE 判断
        scriptNode.onreadystatechange = () => {
            if (scriptNode.readyState == "complete" || scriptNode.readyState == 'loaded') {
                callback();
            }
        }
    } else {
        scriptNode.onload = () => {
            callback();
        }
    }
}


/** 判断是否登录 
 */
export const isLogin = () => {
    return !store.getState().userInfo || !store.getState().userInfo.userId ? false : true;
}


/**
 * 将一维的扁平数组转换为多层级对象
 * @param  {[type]} treeData 一维数组，数组中每一个元素需包含id和pid两个属性 
 * @param  {[type]} parentId 0
 * @return {[type]} tree 多层级树状结构
 */
export const toTreeData = (data,pid) =>{
    function tree(id) {
        let arr = []
        data.filter(item => {
            return item.pid === id;
        }).forEach(item => {
            arr.push({
                ...item,
                children: tree(item.id)
            })
        })
        return arr
    }
    return tree(pid)  // 第一级节点的父id，是null或者0，视情况传入
}



/* 防抖
* fn [function] 需要防抖的函数
* delay [number] 毫秒，防抖期限值
*/
export const debounce = function(fn,delay){
    let timer = null //借助闭包
    return function() {
        if(timer){
            clearTimeout(timer) 
        }
        timer = setTimeout(fn,delay) // 简化写法
    }
}


/* 节流
* fn [function] 需要节流的函数
* delay [number] 毫秒，防抖期限值
*/
export const throttle = function (fn,delay){
    let valid = true
    return function() {
       if(!valid){
           //休息时间 暂不接客
           return false 
       }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}




// crypto-js aes 加解密 
/**
 * 加密（需要先加载lib/aes/aes.min.js文件）
 */
export const encrypt = (word) => {
    var key = CryptoJS.enc.Utf8.parse("0863285e15165b2c"); // '挺哥牛逼' md5后的十六位十六进制数作为密钥
    var srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

/**
 * 解密
 */
export const decrypt = (word) => {
    var key = CryptoJS.enc.Utf8.parse("0863285e15165b2c"); // '挺哥牛逼' md5后的十六位十六进制数作为密钥
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}



/** 添加样式文件
 * @description: 
 * @param {fileUel} 
 * @return: 
 */
export function loadStyles(url) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;  // 引入的文件名
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  
/** 移除样式文件
 * @description: 
 * @param {fileUel} 
 * @return: 
 */
  export function removeStyles(url){
    let filename = url;  // 移除引入的文件名
    let targetelement = "link";
    let targetattr = "href";
    let allsuspects = document.getElementsByTagName(targetelement)
    for (let i = allsuspects.length; i>=0 ; i--){
      if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1) {
        allsuspects[i].parentNode.removeChild(allsuspects[i])
      }
    }
  }


  /** jsonp （要在windows出现后才能用）
 * @description: 
 * @param {options} 
 * @return: 
 */
  export function jsonp(options) {
    // 动态创建script标签
    let script = document.createElement('script');
    // 拼接字符串的变量get请求方式
    let params = '';
    for (let attr in options.data) {
        params += '&' + attr + '=' + options.data[attr];
    }
    // 这里的目的是让每次调用的函数名不同
    let fnName = 'myJsonp' + Math.random().toString().replace('.', '');
    // 它已经不是一个全局函数了
    // 我们要想办法将它变成全局函数
    window[fnName] = options.success;
    // 为script标签添加src属性
    script.src = options.url + '?callback=' + fnName + params;
    // 将script标签追加到页面中
    document.body.appendChild(script);
    // 为script标签添加onload事件
    script.onload = function() {
        document.body.removeChild(script);
    }
}
