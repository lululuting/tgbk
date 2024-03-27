/*
 * @Author: TingGe
 * @Date: 2021-05-26 14:14:18
 * @LastEditTime: 2022-05-04 01:16:08
 * @LastEditors: TingGe
 * @Description: 基本请求方法
 * @FilePath: /ting_ge_blog/public/utils/baseRequest.js
 */
import request from '@/public/utils/request';
import qs from 'qs';

/**
 * 查询列表方法 用get不用post ！！！
 * @description: 公用查询列表方法
 * @param { filters（筛选对象） page limit orderBy(排序方式，二维数组), requestProps（请求配置）}
 * @return: 文章列表/用户列表
 */
export const baseQueryList = (serviceApi, { filters, page, limit, orderBy, requestProps}) => {
  return request(serviceApi, {
    method: 'get',
    params: {
      page: page || 1,
      limit: limit || 10,
      filters: qs.stringify(filters),
      orderBy: qs.stringify({ order: orderBy || [['id', 'desc']]})
    },
    ...requestProps
  });
};


/**
 * 批量操作方法
 * @description: 公共批量操作方法，ids
 * @param { id, ids, otherParams, requestProps }
 * @return: res
 */
export const baseBatch = (serviceApi, { id, ids, otherParams, requestProps}) => {
  return request(serviceApi, {
    method: 'post',
    data: {
      ids: id ? [id] : ids,
      ...otherParams
    },
    ...requestProps
  });
};
