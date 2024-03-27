
基本上传:

    import {Button} from 'antd';
    <FileUploader
      mode="children"
      accept=".jpg,.png,.jpeg,.gif"
      maxSize={1024 * 1024 * 10}
      onChange={(value) =>
        console.log({ avatar: value })
      }
    >
      <Button>
        点击上传
      </Button>
    </FileUploader>

图片裁剪上传:

    import {Form} from 'antd';
    <Form initialValues={{urls: ['https://s1.ax1x.com/2022/10/19/xsMPS0.jpg']}}>
      <Form.Item name="urls" label="图片"
        rules={[{ required: true, message: '请上传图片!' }]}
      >
        <FileUploader
          mode="image"
          accept=".jpg,.png,.jpeg,.gif"
          maxSize={1024 * 1024 * 2} // 2m
          cropOption={{
            aspect: 100 / 100
          }}
        />
      </Form.Item>
    </Form>

文件上传:

    import {Form} from 'antd';
    <Form>
      <Form.Item
        label="文件"
        name="files"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <FileUploader
          mode="file"
          maxLength={3}
        />
      </Form.Item>
    </Form>