import { createStore } from 'redux';
import reducer from './reducer';

// 引入查看redux的工具插件
// eslint-disable-next-line no-undef
const { composeWithDevTools } = require('redux-devtools-extension');

let store = createStore(reducer, composeWithDevTools());
export default store;
