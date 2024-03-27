
单独使用:

     <TagsAdd value={['靓仔','煲汤','凉茶']} onChange={(value)=>{console.log(value)}} />

展示模式:

     <TagsAdd isEdit={false} value={'靓仔,煲汤,凉茶'} />


配件form使用：

    import {Form} from 'antd';
    <Form>
      <Form.Item
        label="标签"
        name="tags"
        rules={[{ required: true, message: '不能为空' }]}
      >
        <TagsAdd />
      </Form.Item>
    </Form>