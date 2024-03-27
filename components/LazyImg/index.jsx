/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-06-14 15:55:49
 * @LastEditors: TingGe
 * @Description:
 *  props.background  背景图模式
 * @FilePath: /ting_ge_blog/components/LazyImg/index.jsx
 */

// import classnames from 'classnames';
import Image from 'next/image';
import styles from './style.module.less';

const LazyImg = (props) => {
  let src = props.src;
  
  if(/^\/\//.test(src)){
    src = 'https:'+props.src;
  }
  if (props.crop && props.width && props.height) {
    src = `${src}?imageView2/1/w/${props.width}/h/${props.height}`;
  }

  const otherProps = {...props};
  if(otherProps.background){
    delete otherProps.background;
  }

  return (
    <>
      {props.background
        ? (
          <div className={styles['background-box']} {...otherProps}>
            {props.children ? props.children : null}
            <Image
              layout="fill"
              objectFit="cover"
              src={src}
            />
          </div>)
        : (
          <Image
            {...props}
            src={src}
          />
        )
      }
    </>
  );
};
export default LazyImg;
