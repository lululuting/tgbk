import React, { useState } from 'react'
import { BackTop, Icon, Modal, Form, Input, Button, message } from 'antd'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import './style.less'

const Side = (props) => {
	const [visible, setVisible] = useState(false)
	const { getFieldDecorator } = props.form
	const formItemLayout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 18 },
	}

	const handleSubmit = e => {
		e.preventDefault();
		props.form.validateFields((errors, values) => {
			if (errors) {
				return;
			}
			
			request(serviceApi.feedback, {
				method: 'post',
				data: values
			}).then((res) => {
				if(res.code == 200){
					message.success('提交成功，谢谢!')
					props.form.resetFields();
					setVisible(false)
				}else{
					message.success('提交失败了，请联系挺哥！')
				}
			})

		});
	};

	return (
		<div id="side">
			<BackTop>
				<div className="action-btn">
					<Icon type="arrow-up" style={{ fontSize: 20 }} />
				</div>
			</BackTop>

			<div className="action-btn" style={{ cursor: 'pointer' }} onClick={()=>setVisible(true)}>
				<Icon type="bug" style={{ fontSize: 20 }} />
			</div>

			<Modal
					title="问题收集"
					visible={visible}
					onCancel={() => {props.form.resetFields(); setVisible(false)}}
					footer={null}
					width={500}
				>
						<Form layout="horizontal" {...formItemLayout}>
							<Form.Item label="问题">
								{getFieldDecorator('title', {
									rules: [{ required: true, message: '请填写' }],
								})(<Input placeholder="欢迎提交bug或者有什么建议的都可以" />)}
							</Form.Item>

							<Form.Item label="描述">
								{getFieldDecorator('description', {
									rules: [{ required: true, message: '请填写' }],
								})(
									<Input.TextArea style={{ width: '100%' }} rows={4} placeholder="具体是什么呢" />
								)}
							</Form.Item>

							<Form.Item label="联系方式">
								{getFieldDecorator('contact')(
									<Input.TextArea  placeholder="如果可以，请留下联系方式" />
								)}
							</Form.Item>

							<Form.Item label=" " colon={false} style={{ margin: 0 }}>
								<Button type="primary" onClick={handleSubmit}>
									提交
							</Button>
							</Form.Item>

						</Form>
				</Modal>

		</div>
	)
}

const SideForm = Form.create({ name: 'side_form' })(Side)
export default SideForm