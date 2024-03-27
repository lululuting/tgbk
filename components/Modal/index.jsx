import React from 'react';
import { Modal } from 'antd';

export default class Component extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  handleToggleVisible = () => {
    this.setState({
      visible: !this.state.visible
    }, () => {
      if (this.state.visible) {
        this.props.onCancelBefore && this.props.onCancelBefore();
      } else {
        this.props.onCancelAfter &&  this.props.onCancelAfter();
      }
    });
  };

  render () {
    return (<span>
      <span onClick={this.handleToggleVisible}>
        {this.props.children || ''}
      </span>

      <Modal
        destroyOnClose
        open={this.state.visible}
        onCancel={this.handleToggleVisible}
        {...this.props}
      >
        {this.props.content}
      </Modal>
    </span>);
  }
}
