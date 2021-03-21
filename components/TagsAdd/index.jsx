/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-02-06 09:49:36
 * @LastEditors: TingGe
 * @Description: 添加标签
 * @FilePath: /ting_ge_blog/components/TagsAdd/index.js
 */

import React from 'react';
import { Modal, Tag, Input, Tooltip } from 'antd';
import {
	PlusOutlined
} from '@ant-design/icons';

export default class EditableTagGroup extends React.Component {
  state = {
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    this.setState({
      tags: this.props.data
    })
  }

  // 更新props
  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.setState({
        tags: this.props.data
      });
    }
  }

  handleClose = (e, removedTag) => {
    e.preventDefault();
    Modal.confirm({
      title: '删除标签',
      content: '老铁，确定删除该标签吗？',
      onOk: () => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        this.setState({ tags }, () => {
          // 回调给个人中心修改用
          if (this.props.callback) {
            this.props.callback(this.state.tags)
          }
        });

      }
    });
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    }, () => {
      // 回调给个人中心修改用
      if (this.props.callback) {
        this.props.callback(this.state.tags)
      }
    });

  };

  saveInputRef = input => (this.input = input);

  render() {
    const { tags, inputVisible, inputValue } = this.state;

    const { isEdit: isEdit = true } = this.props;

    return (
      <div>
        {tags.map((tag, index) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag color="blue" key={tag} closable={isEdit} onClose={(e) => this.handleClose(e, tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
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
        {!inputVisible && isEdit &&
          <Tag color="#1890ff" onClick={this.showInput} style={{ borderStyle: 'dashed' }}>
            <PlusOutlined /> 新增标签
          </Tag>
        }

      </div>
    );
  }
}
