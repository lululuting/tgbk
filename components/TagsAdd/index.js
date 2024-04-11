import React from 'react';
import _ from 'lodash';
import { Modal, Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const filterInitValue = (data) => {
  if (_.isString(data)) {
    return data?.split(',');
  } else if (_.isArray(data)) {
    return data;
  } else {
    return [];
  }
};

/**
 * Tags 编辑组件 可配合 antd 4.x form 使用
 * */
export default class TagsAdd extends React.Component {
  static propTypes = {

    /** 数据源 可接受字符串/数组*/
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),

    /** 是否返回字符串格式数据*/
    isReturnStr: PropTypes.bool,

    /** onChange  */
    onChange: PropTypes.func,

    /** 是否编辑  */
    isEdit: PropTypes.bool,

    /** 超过多少字为长tag  */
    longTagLength: PropTypes.number
  };

  static defaultProps = {
    value: [],
    isEdit: true,
    isReturnStr: true,
    longTagLength: 20
  };

  constructor (props) {
    super(props);
    this.state = {
      tags: _.isString(props.value) ? filterInitValue(props.value) : props.value,
      inputVisible: false,
      inputValue: ''
    };
  }


  handleClose = (e, removedTag) => {
    e.preventDefault();
    Modal.confirm({
      title: '删除标签',
      content: '老铁，确定删除该标签吗？',
      onOk: () => {
        const tags = this.state.tags.filter((tag) => tag !== removedTag);
        this.setState({ tags }, () => {
          if (this.props.onChange) {
            this.props.onChange(this.state.tags);
          }
        });
      }
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState(
      {
        tags,
        inputVisible: false,
        inputValue: ''
      },
      () => {
        if (this.props.onChange) {
          this.props.onChange( this.props.isReturnStr ? this.state.tags.join(',') : this.state.tags);
        }
      }
    );
  };

  saveInputRef = (input) => (this.input = input);

  render () {
    const { tags, inputVisible, inputValue } = this.state;
    const { isEdit, longTagLength } = this.props;

    return (
      <div>
        {_.map(tags, (tag) => {
          const isLongTag = tag.length > longTagLength;
          const tagElem = (
            <Tag
              color="blue"
              key={tag}
              closable={isEdit}
              style={{ marginTop: 5 }}
              onClose={(e) => this.handleClose(e, tag)}
            >
              {isLongTag ? `${tag?.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {inputVisible && (
          <Input
            ref={this.saveInputRef}
            type="text"
            size="small"
            style={{ width: 78 }}
            value={inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleInputConfirm}
            onPressEnter={this.handleInputConfirm}
          />
        )}
        {!inputVisible && isEdit && (
          <Tag
            color="#1890ff"
            onClick={this.showInput}
            style={{ borderStyle: 'dashed', marginTop: 5 }}
          >
            <PlusOutlined /> 新增标签
          </Tag>
        )}
      </div>
    );
  }
}
