import { message, Form, Input, Modal, Tooltip } from 'antd';
import Cookies from 'js-cookie';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import { InfoCircleOutlined } from '@ant-design/icons';

const FormItem = Form.Item;

// 更改网易云歌单id组件
const EditSongsForm = (props) => {
  const [form] = Form.useForm();

  const handleEditSongs = () => {
    form
      .validateFields()
      .then((fieldsValue) => {
        request(serviceApi.updateSongs, {
          method: 'post',
          data: fieldsValue
        }).then((res) => {
          if (res.code == 200) {
            message.success(res.msg);
            props.getUserInfo((res) => {
              let userInfo = Cookies.getJSON('userInfo');
              userInfo = Object.assign(userInfo, res);
              Cookies.set('userInfo', userInfo, {
                expires: userInfo.cookiesCreateAt
              });
              props.userInfoChange(userInfo);
              props.setModalVisible(false);
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
      title="更改歌单"
      width={300}
      destroyOnClose
      open={props.modalVisible}
      okText="保存"
      onOk={handleEditSongs}
      onCancel={() => {
        props.setModalVisible(false);
        form.resetFields();
      }}
      maskClosable={false}
      confirmLoading={props.confirmLoading}
    >
      <Form
        form={form}
        name="songsForm"
        initialValues={{
          songsId: props.initialValue
        }}
        onFinish={handleEditSongs}
      >
        <FormItem label="网易云歌单ID" name="songsId">
          <Input
            placeholder="请输入网易云歌单ID"
            suffix={
              <Tooltip title="网易云歌单ID获取方法：登录网页版网易云音乐点击你喜欢的歌单，然后看浏览器URL地址最后一段数字">
                <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
              </Tooltip>
            }
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EditSongsForm;
