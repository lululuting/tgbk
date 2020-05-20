import React from 'react'
import ReactDOM from 'react-dom'
import Login from './login'

let loginRef = null;

function createLoginDom() {
    const div = document.createElement('div')
    document.body.appendChild(div)

    //  注意 antd from包裹过的ref 要wrappedComponentRef
    ReactDOM.render(<Login wrappedComponentRef={(ref)=>{loginRef = ref}}/>, div)
    return {
        setVisible(visible) {
            return loginRef.setVisible(visible)
        },
    }
}

let LoginDom
const setVisible = (visible) => {
    if (!LoginDom) LoginDom = createLoginDom()
    return LoginDom.setVisible(visible)
}


// 暴露两个方法
export default {
    show() {
        return setVisible(true)
    },
    hide() {
        return setVisible(false)
    },
}