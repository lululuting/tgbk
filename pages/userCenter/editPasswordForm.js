
import {
  message,
  Form,
  Input,
  Modal
} from 'antd';
import Router from 'next/router';
import Cookies from 'js-cookie';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';

const FormItem = Form.Item;

// 绑定手机form组件
const EditPasswordForm = (props) => {
  const [form] = Form.useForm();

  // 修改密码
  const handleEditPwd = () => {
    form
      .validateFields()
      .then((fieldsValue) => {
        request(serviceApi.updatePassword, {
          method: 'post',
          data: fieldsValue
        }).then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            Cookies.remove('userInfo');
            Router.replace({
              pathname: '/'
            });
          }
        });
      })
      .catch((info) => {
        console.log('验证失败:', info);
      });
  };

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  };

  return (
    <Modal
      title="更改密码"
      width={500}
      destroyOnClose
      open={props.modalVisible}
      okText="保存"
      onOk={handleEditPwd}
      onCancel={() => {
        props.setModalVisible(false);
        form.resetFields();
      }}
      maskClosable={false}
      confirmLoading={props.updatePasswordLoading}
    >
      <Form
        form={form}
        name="editPwd"
        initialValues={{
          oldPassword: '',
          newPassword: ''
        }}
        onFinish={handleEditPwd}
      >
        <FormItem
          {...formLayout}
          label="旧密码"
          name="oldPassword"
          rules={[
            { required: true, message: '旧密码不能为空！' }
          ]}
        >
          <Input.Password placeholder="请输入旧密码" />
        </FormItem>
        <FormItem
          {...formLayout}
          label="新密码"
          name="newPassword"
          rules={[
            { required: true, message: '新密码不能为空！' },
            {
              message: '密码长度应为6~20位之间',
              min: 6,
              max: 20
            }
          ]}
        >
          <Input.Password placeholder="请输入新密码（6~20位）" />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default EditPasswordForm;

