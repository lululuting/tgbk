/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-01-31 14:34:38
 * @LastEditors: TingGe
 * @Description: IconFont组件
 * @FilePath: /tg-blog/components/IconFont/index.js
 */

import {
	createFromIconfontCN
} from '@ant-design/icons';

const IconFont = createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1114998_0lw18wehi7i.js',
});

export default IconFont