/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-04-03 14:35:02
 * @LastEditors: TingGe
 * @Description: 赞赏码设置组件
 * @FilePath: /ting_ge_blog/components/Rewards/index.jsx
 */

import React from 'react';
import _ from 'lodash';
import { Form, Select } from 'antd';
import FileUploader from '@/components/FileUploader';
import SvgIcon from '@/components/SvgIcon';
import Contact from '@/components/Contact';
import styles from './style.module.less';

const FormItem = Form.Item;
const Option = Select.Option;


class Reward extends Contact {
  constructor (props) {
    super(props);
    _.assign(this.state, {
      modeTitle: '赞赏码',
      typeArr: [
        {
          label: '微信',
          value: 'wx',
          icon: <SvgIcon name="iconweixin" style={{ fontSize: 30 }} />
        },
        {
          label: '支付宝',
          value: 'zfb',
          icon: <SvgIcon name="iconzhifubao1" style={{ fontSize: 30 }} />
        }
      ]
    });
  }

  // 确定
  handleOk = () => {
    const { currentItem } = this.state;
    this.formRef
      .validateFields()
      .then((fieldsValue) => {
        let valueArr  = this.state.valueArr;
        if (currentItem?.index) {
          valueArr[currentItem.index - 1] = fieldsValue;
        } else {
          valueArr = [...this.state.valueArr, fieldsValue];
        }
        this.setState({ valueArr }, () => {
          this.handleCancel();
          if (this.props.onChange) {
            this.props.onChange(this.filterValue());
          }
        });
      })
      .catch((info) => {
        console.log('验证失败:', info);
      });
  };


  switchType = (type) => {
    return (
      _.map(this.state.typeArr, (item) =>{
        if (item.value === type) {
          return item.icon;
        }
        return null;
      })
    );
  };

  renderForm = () => {
    const { currentItem, typeArr } = this.state;
    const formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 }
    };

    return (
      <Form
        ref={(ref) => (this.formRef = ref)}
        {...formLayout}
        initialValues={{
          type: currentItem?.type,
          code: currentItem?.code
        }}
        onFinish={this.handleOk}
      >
        <FormItem
          label="赞赏类型"
          name="type"
          rules={[{ required: true, message: '请选择赞赏类型' }]}
        >
          <Select style={{ width: '100% ' }} placeholder="请选择赞赏类型">
            {_.map(typeArr, (item, index)=> {
              return <Option value={item.value} key={index}>
                <div style={{ display: 'flex', alignItems: 'center'}}>
                  {item.icon}
                  {item.label}
                </div>
              </Option>;
            })}
          </Select>
        </FormItem>
        <FormItem
          name="code"
          label="二维码"
          rules={[{ required: true, message: '请上传二维码' }]}
          className={styles['update-code']}
        >
          <FileUploader
            mode="image"
            maxLength={1}
            accept=".jpg,.png,.jpeg"
            maxSize={1024 * 1024 * 2} // 2m
            cropOption={{
              aspect: 200 / 200
            }}
          />
        </FormItem>
      </Form>
    );
  };
}

export default Reward;
