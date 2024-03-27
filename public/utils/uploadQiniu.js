/*
 * @Date: 2020-05-16 23:11:06
 * @LastEditors: TingGe
 * @LastEditTime: 2022-03-08 23:11:11
 * @FilePath: /ting_ge_blog/public/utils/uploadQiniu.js
 */
import { v1 as uuidv1 } from 'uuid';
import request from '@/public/utils/request';
import { message } from 'antd';
import serviceApi from '@/config/service';

/** *
 * file 上传文件
 * callback Promise 回调
 */

export const uploadQiniu = async (file, callback) => {
  let formData = new FormData();
  // 获取签名

  await request(serviceApi.getQiniuToken, {
    // credentials: 'omit' // 带上cookie七牛会跨域，忽略cookie的发送
  }).then((res) => {
    if (res && res.data) {
      formData.append('file', file);
      formData.append('token', res.data.uploadToken);
      formData.append('key', uuidv1() + '|t_g_b_k|' + file.name); // 自定义上传图片的名字，即上传成功后七牛返回给我们的图片名字
    }
  });

  return new Promise((resolve) =>
    request(serviceApi.uploadQiniu, {
      credentials: 'omit',
      method: 'post',
      data: formData
    }).then((res) => {
      if (res && res.key) {
        const key = '//cdn.lululuting.com/' + res.key;
        if (callback) {
          callback(key).then((r) => {
            resolve(r);
          });
          return;
        }
        resolve(key);
      } else {
        message.error('上传七牛云出错！请联系挺哥！');
        return;
      }
    })
  );
};
