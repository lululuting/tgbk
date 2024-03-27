/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2022-02-10 10:48:48
 * @LastEditors: TingGe
 * @Description: login
 * @FilePath: /ting_ge_blog/components/Login/index.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Login from './login';

let loginRef = null;

function createLoginDom () {
  const div = document.createElement('div');
  document.body.appendChild(div);

  // 注意 antd 3x版本的 from包裹过的ref 要wrappedComponentRef
  ReactDOM.render(
    <Login
      ref={(ref) => {
        loginRef = ref;
      }}
    />,
    div
  );
  return {
    setVisible (visible) {
      return loginRef.setVisible(visible);
    }
  };
}

let LoginDom;
const setVisible = (visible) => {
  if (!LoginDom) LoginDom = createLoginDom();
  return LoginDom.setVisible(visible);
};

// 暴露两个方法
export default {
  show () {
    return setVisible(true);
  },
  hide () {
    return setVisible(false);
  }
};
