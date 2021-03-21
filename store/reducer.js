
import serviceApi from '@/config/service'

// 统一处理 api 的 loading状态 注册到redux里面  实现dva-loading的效果 
let apiLoading = {}
for(let item in serviceApi){
    item = item + 'Loading'
    apiLoading[item] = false
}

const defalutState = {
    userInfo: null,
    msgData: [],
    currentArticleInfo: {},
    ...apiLoading
}

export default (state = defalutState, action) => {

    if(action.type === 'changeUserInfo'){
        let newState = JSON.parse(JSON.stringify(state))
        newState.userInfo = action.payload
        return newState
    }

    if(action.type === 'changeLoading'){
        let newState = JSON.parse(JSON.stringify(state))
        newState[action.payload.api] = action.payload.status
        return newState
    }

    if(action.type === 'changeMsg'){
        let newState = JSON.parse(JSON.stringify(state))
        newState.msgData = action.payload
        return newState
    }

    if(action.type === 'changeCurrentArticleInfo'){
        let newState = JSON.parse(JSON.stringify(state))
        newState.currentArticleInfo = action.payload
        return newState
    }

    return state
}