import * as React from 'react';
import * as _ from 'lodash';
import { Pagination } from 'antd';
import { baseQueryList } from '../../public/utils/baseRequest';

/**定义函数组件父传子 属性值类型。问号：该属性可有可无
接口的声明不要放在import语句的前面，可能会报错**/
// type Key = string | number;

// 该类型的变量值只能是两种：null 和 ReactElement实例。通常情况下，函数组件返回ReactElement（JXS.Element）的值。
interface ReactElement <
  P = any,
  T extends string | React.JSXElementConstructor<any> =
  | string
  | React.JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: string | number | null;
}
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;
interface ReactNodeArray extends Array<ReactNode> { }
type ReactFragment = {} | ReactNodeArray;
interface ReactPortal extends ReactElement {
  key: string | number | null;
  children: ReactNode;
}
type ReactNode =
  | ReactChild
  | ReactFragment
  | ReactPortal
  | boolean
  | null
  | undefined;

interface PropsFC {
  /** 模式 普通分页和无限分页 */
  mode?: 'routine' | 'infinite'; // 枚举
  /** 分页页数 */
  page?: number;
  /** 分页条数 */
  limit?: number;
  /** 是否展示加载更多 */
  loadMore?: boolean;
  children?: any;
  /** 格外的分页属性 用法与antd pagination组件一致 */
  paginationProps?: any;
  /** 自定义请求方法 接口路径/Promise */
  queryPromise?: string | (() => any);
  /** 自定义请求方法参数  BaseQueryList */
  queryParam?: any;
  /** 自定义没有数据的的提示 */
  noDataTips?: ReactNode;
  /** 没有更多数据的提示 */
  noMoreDataTips?: ReactNode;
  /** 自定义list的render方法 */
  renderList?: (list: ItemType[]) => ReactElement;
  /** 自定义item的render方法 */
  renderItem?: (item?: {}, index?: number, list?: any[]) => any;
}

interface ItemType {
  key: number | string;
  value: string;
}

type QueryListParam = {
  curPage?: number;
  curLimit?: number;
};

/**
 * 通用列表页 组件
 */
// FC:function component 函数组件
const BaseList: React.FC<PropsFC> = (props) => {
  // 格式 const [状态变量,修改状态的方法]=useState<变量的类型>(变量的值)
  const [list, setList] = React.useState<any[]>([]);
  const [page, setPage] = React.useState<number>(props.page || 1);
  const [limit, setLimit] = React.useState<number>(props.limit || 10);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [isNoMoreData, setIsNoMoreData] = React.useState<boolean>(false);

  React.useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    setPage(page + 1);
    let data = await getListDataPromise();
    setList([...list, ...data]);
    if (!data.length) {
      setIsNoMoreData(true);
    }
  };

  const getListDataPromise = (queryListParam?: QueryListParam) => {
    setLoading(true);
    let api: string = '默认的api地址';
    if (props.queryPromise) {
      // 传入queryPromise方法
      if (_.isFunction(props.queryPromise)) {
        return props.queryPromise().finally(() => {
          setLoading(false);
        });
      }

      // 传入api和筛选条件
      let api: string = props.queryPromise;
      return baseQueryList(api, props.queryParam || {}).finally(() => {
        setLoading(false);
      });
    }

    // 如果没有传入queryPromise 走默认moke

    let data: Array<ItemType> = [];
    for (let i = 0; i < (queryListParam?.curLimit || limit); i++) {
      data.push({
        key: (queryListParam?.curPage || page) + '_' + i + 'key',
        value: (queryListParam?.curPage || page) + '_' + i + 'value',
      });
    }

    return new Promise((req, rej) => {
      console.log('api：' + api);
      setTimeout(() => {
        req(data);
      }, 1000);
    }).finally(() => {
      setLoading(false);
    });
  };

  const renderNoMoreData = (): any => {
    if (typeof props.noMoreDataTips === 'function') {
      return props.noMoreDataTips();
    } else {
      return props.noMoreDataTips || '没有更多数据了';
    }
  };

  const paginationChange = async (page: number, limit: number) => {
    setPage(page);
    setLimit(limit);
    let data = await getListDataPromise({
      curPage: page,
      curLimit: limit,
    });
    setList(data);
  };

  return (
    <div>
      <div style={{ minHeight: 100, position: 'relative' }}>
        {props.renderList
          ? props.renderList(list)
          : list.length
            ? list.map((item, index) => {
              // 自定义renderItem
              if (props.renderItem) {
                return props.renderItem(item, index, list);
              }
              return <div key={item.key}>{item.value}</div>;
            })
            : props.noDataTips}
        {props.children}

        {loading ? (
          <div
            style={{
              position: 'absolute',
              width: '100%',
              bottom: '0',
              height: '100%',
              backgroundColor: 'rgb(0 0 0 / 22%)',
              color: '#fff',
            }}
          >
            loading...
          </div>
        ) : null}
      </div>
      {/* 分页 */}
      {props.mode === 'routine' ? (
        <Pagination
          total={20}
          size="small"
          defaultCurrent={1}
          onChange={paginationChange}
          {...props.paginationProps}
        />
      ) : !isNoMoreData ? (
        <button onClick={getListData} disabled={loading}>
          加载更多
        </button>
      ) : (
        renderNoMoreData()
      )}
    </div>
  );
};

//定义props的默认值
BaseList.defaultProps = {
  loadMore: true,
  mode: 'routine',
  noDataTips: '没有数据'
};

export default BaseList;

// // ------------------------------------------------------------------------------------------------
// // 类组件
// interface Props {
//   color?: string;
// }

// //定义state中键的类型
// interface States {
//   msg: number;
//   age: number;
// }

// /**声明一个类组件 Component<定义props的数据类型,定义state的数据类型>**/
// export class Ulist extends React.Component<Props, States> {
//   //定义props的默认值
//   static defaultProps = {
//     color: 'red',
//   };
//   state = {
//     msg: 123,
//     age: 10,
//   };
//   render() {
//     let { color } = this.props;
//     return (
//       <div style={{ color }}>
//         msg:{this.state.msg}, age: {this.state.age},
//       </div>
//     );
//   }
// }
