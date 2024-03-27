
import {
  message,
  Form,
  Input,
  Modal,
  Tooltip
} from 'antd';
import Router from 'next/router';
import Cookies from 'js-cookie';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import {
  InfoCircleOutlined
} from '@ant-design/icons';

const FormItem = Form.Item;

// 绑定手机form组件
const BindMobileForm = (props) => {
  const [form] = Form.useForm();

  const handleEditMobile = () => {
    form
      .validateFields()
      .then((fieldsValue) => {
        request(serviceApi.updateMobile, {
          method: 'post',
          data: fieldsValue
        }).then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            props.userInfoChange(null);
            Cookies.set('userInfo', null);
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

  return (
    <Modal
      title="绑定手机"
      width={300}
      destroyOnClose
      open={props.modalVisible}
      okText="保存"
      onOk={handleEditMobile}
      onCancel={() => {
        props.setModalVisible(false);
        form.resetFields();
      }}
      maskClosable={false}
      confirmLoading={props.confirmLoading}
    >
      <Form
        form={form}
        name="bindMobile"
        initialValues={{
          mobile: props.initialValue
        }}
        onFinish={handleEditMobile}
      >
        <FormItem
          label="手机号"
          name="mobile"
          rules={[
            { required: true, message: '手机号不能为空' },
            {
              message: '手机号不正确',
              pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g')
            }
          ]}
        >
          <Input
            placeholder="请输入要绑定的手机号"
            suffix={
              <Tooltip title="绑定的手机号将作为登录账号。第一次绑定的初始密码为123456，后面更换绑定不重置，密码不可逆，请妥善保管！">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </FormItem>
      </Form>
    </Modal>
  );
};
export default BindMobileForm;
