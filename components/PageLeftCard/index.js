import _ from 'lodash';
import { Card } from 'antd';
import ArticleSort from '@/components/ArticleSort';
import styles from './style.module.less';

export default (props) => {
  const otherProps = {...props};
  if(otherProps.sortFn){
    delete otherProps.sortFn;
  }
  return <div className={styles['list-nav']}>
    <Card
      bordered={false}
      extra={
        _.isFunction(props.sortFn) && !_.isEmpty(props.title) &&  _.isEmpty(props.tabList) ?  <ArticleSort onChange={props.sortFn}/> : null
      }
      tabBarExtraContent={
        _.isFunction(props.sortFn) && _.isEmpty(props.title) && !_.isEmpty(props.tabList) ?  <ArticleSort onChange={props.sortFn}/> : null
      }
      {...otherProps}
    >
      {props.children}
    </Card>
  </div>;
};
