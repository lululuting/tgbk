/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-05-18 17:46:06
 * @LastEditors: TingGe
 * @Description: 通用上传文件插件, 可配合 antd 4x form的使用
 * @FilePath: /ting_ge_blog/components/FileUploader/index.js
 */

import React from 'react';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import _ from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PictureOutlined, FileTwoTone } from '@ant-design/icons';
import { getSize } from '@/public/utils/utils';
import { uploadQiniu } from '@/public/utils/uploadQiniu';
import styles from './index.module.less';

// 处理initValue值
const setInitValue = (value) => {
  let fileList = [];

  if (_.isEmpty(value)) {
    return [];
  }

  if (_.isArray(value)) {
    fileList = _.map(value, (item, index) => {
      return {
        uid: index,
        name: item,
        status: 'done',
        url: item
      };
    });
  }

  if (_.isString(value)) {
    fileList = [
      {
        uid: 1,
        name: value,
        status: 'done',
        url: value
      }
    ];
  }
  return fileList;
};

// 处理返回值
const setReturnValue = (fileList, maxLength) => {
  if (_.isEmpty(fileList)) {
    return null;
  }

  if (_.isArray(fileList)) {
    fileList = _.map(fileList, (item) => {
      return item.url;
    });
  }

  // 如果是一个 返回字符串
  if (maxLength === 1) {
    return fileList[0];
  }

  // 返回数组
  return fileList;
};

/**
 * 通用上传文件插件, 可配合 antd 4.x form 使用
 * 基本的props和Input一致
 */
class FileUploader extends React.Component {
  static propTypes = {

    /** 模式， image/file/children -> 图片/文件/插槽 */
    mode: PropTypes.string,

    /**  文件规则 */
    accept: PropTypes.string,

    /**  自定义上传错误文字, 或者可以传进一个函数返回dom, (file)=> <div>{file.name}</div> */
    customUploadAccpetErrorTips: PropTypes.string,

    /**  是否多选, 与crop冲突，开启裁剪后只能单选*/
    multiple: PropTypes.bool,

    /**  最多上传数量 */
    maxLength: PropTypes.number,

    /**  单文件最大大小(k) */
    maxSize: PropTypes.number,

    /**  裁剪属性, 与multiple冲突，开启裁剪只能单选, 其他与antd-img-crop插件用法一致 */
    cropOption: PropTypes.object,

    /**  value值/initValue初始值 */
    value: PropTypes.array || PropTypes.string,

    /**  额外的Upload的props */
    uploadProps: PropTypes.object,

    /**  外层style样式 */
    style: PropTypes.object,

    /**  外层class样式类名 */
    className: PropTypes.string
  };

  static defaultProps = {
    mode: 'file',
    accept: '*',
    customUploadAccpetErrorTips: null,
    multiple: false,                    // 是否多选，bool， 与crop冲突，开启裁剪后只能单选
    maxLength: 1,                       // 最多上传数量， number
    maxSize: 1024 * 1024 * 2,           // 文件最大大小，number
    value: [],                          // value的映射， arr
    uploadProps: {},                    // 额外的Upload的props
    style: {},
    className: '',
    cropOption: {}                     // 裁剪属性 obj， 与multiple冲突，开启裁剪只能单选

    // cropOption 裁剪属性
    // 属性	   类型	   默认	  说明
    // aspect	number	1 / 1	裁切区域宽高比，width / height
    // shape	string	'rect'	裁切区域形状，'rect' 或 'round'
    // grid	boolean	false	显示裁切区域网格（九宫格）
    // quality	number	0.4	图片质量，0 ~ 1
    // fillColor	string	'white'	裁切图像小于画布时的填充颜色
    // zoom	boolean	true	启用图片缩放
    // rotate	boolean	false	启用图片旋转
    // minZoom	number	1	最小缩放倍数
    // maxZoom	number	3	最大缩放倍数
    // modalTitle	string	'编辑图片'	弹窗标题
    // modalWidth	number | string	520	弹窗宽度，px 的数值或百分比
    // modalOk	string	'确定'	弹窗确定按钮文字
    // modalCancel	string	'取消'	弹窗取消按钮文字
    // onModalOK	function	-	点击弹窗确定回调
    // onModalCancel	function	-	点击弹窗遮罩层、右上角叉、取消的回调
    // beforeCrop	function	-	弹窗打开前调用，若返回 false，弹框将不会打开
    // onUploadFail	function	-	上传失败时的回调
    // cropperProps	object	-	react-easy-crop 的 props（* 已有 props 无法重写）
  };

  constructor (props) {
    super(props);
    this.state = {
      fileList: setInitValue(props.value) // value的映射， arr
    };
  }

  // 拖拽文件上传 样式dom
  draggerUploadRenderDom = () => {
    return (
      <div className="dragger-upload-box">
        <p className="ant-upload-drag-icon">
          {this.props.mode === 'file' ? <FileTwoTone /> : <PictureOutlined />}
        </p>
        <p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
        <p className="ant-upload-hint">
          {this.props.accept === '*'
            ? null
            : `只能上传限${this.props.accept}格式的文件，${getSize(
              this.props.maxSize
            )}以下！`}
        </p>
      </div>
    );
  };

  // 校验文件类型 返回 布尔
  checkFileType = (file) => {
    const { accept, customUploadAccpetErrorTips } = this.props;
    if (accept && '*' !== accept) {
      let messageStr = '';
      const hasErrorTips =
        customUploadAccpetErrorTips && _.isString(customUploadAccpetErrorTips);
      if (accept.startsWith('.')) {
        const type = _.last(_.get(file, 'name').split('.'));
        const validateType = accept.replace(/\./g, '').split(',');
        if (!_.includes(validateType, type)) {
          if (!hasErrorTips) {
            messageStr = `${_.get(file, 'name', '')} 文件格式不正确`;
          } else {
            messageStr = customUploadAccpetErrorTips;
          }
          message.error(messageStr);
          return false;
        }
      }
    }
    return true;
  };

  render () {
    const { fileList } = this.state;
    const { maxSize, maxLength, mode, cropOption, multiple, uploadProps } = this.props;

    // 是否隐藏上传
    const isHideUploader = fileList.length >= maxLength;

    // 上传参数
    const updateProps = {
      onRemove: (file) => {
        this.setState(
          (state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            newFileList.splice(index, 1);
            return {
              fileList: newFileList
            };
          },
          () => {
            if ('function' === typeof this.props.onChange) {
              this.props.onChange(
                setReturnValue(this.state.fileList, maxLength)
              );
            }
          }
        );
      },
      beforeUpload: (file) => {
        // 校验文件类型
        if (!this.checkFileType(file)) {
          return false;
        }

        // 校验文件大小
        if (file.size >= maxSize) {
          message.error(`${file.name} 不能超过${getSize(maxSize)}`);
          return false;
        }
        return true;
      },
      customRequest: async (event) => {
        const file = event.file;

        // 七牛上传
        const fileUrl = await uploadQiniu(file);

        // 组装antd要求的格式
        const fileItem = {
          uid: fileUrl,
          name: file.name,
          status: 'done',
          url: fileUrl
        };

        this.setState(
          {
            fileList: [...this.state.fileList, fileItem]
          },
          () => {
            if ('function' === typeof this.props.onChange) {
              this.props.onChange(
                setReturnValue(this.state.fileList, maxLength)
              );
            }
          }
        );
        return false;
      },
      fileList,
      ...uploadProps
    };

    return (
      <div className={classNames(styles['file-uploader-box'], this.props.className)}>
        {mode === 'file' ? (
          <Upload.Dragger
            {...updateProps}
            name="files"
            listType={mode === 'image' && 'picture'}
            multiple={multiple}
            className={classNames(styles['file-uploader'], isHideUploader ? styles['hide-uploader'] : null)}
            maxCount={maxLength}
          >
            {isHideUploader ? null : this.draggerUploadRenderDom()}
          </Upload.Dragger>
        ) : (
          <>
            {mode === 'image' ? (
              <ImgCrop
                beforeCrop={this.checkFileType}
                grid
                rotate
                modalTitle="上传裁剪"
                {...cropOption}
              >
                <Upload.Dragger
                  {...updateProps}
                  name="avatar"
                  listType="picture-card"
                  className={classNames(styles['file-uploader'], isHideUploader ? styles['hide-uploader'] : null)}
                  // className={styles.}
                  maxCount={maxLength}
                >
                  {isHideUploader ? null : this.draggerUploadRenderDom()}
                </Upload.Dragger>
              </ImgCrop>
            ) : null}

            {mode === 'children' && !_.isEmpty(cropOption) ? (
              <ImgCrop
                beforeCrop={this.checkFileType}
                grid
                rotate
                modalTitle="上传裁剪"
                {...cropOption}
              >
                <Upload 
                  showUploadList={false} 
                  {...updateProps} 
                  name="avatar" 
                  maxCount={maxLength}
                >
                  {this.props.children}
                </Upload>
              </ImgCrop>
            )
              : <Upload showUploadList={false} {...updateProps} name="avatar" maxCount={maxLength}>
                {this.props.children}
              </Upload>
            }
          </>
        )}
      </div>
    );
  }
}

export default FileUploader;
