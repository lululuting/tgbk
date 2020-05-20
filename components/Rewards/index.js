import React, { Component } from 'react'
import { uploadQiniu } from '@/public/utils/uploadQiniu'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import {
	Modal,
	Form,
	Upload,
	Icon,
	message,
	Popover,
} from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1114998_4jihdzu0g8p.js',
})

class Reward extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false,
			currentType: null,
			fileList: [],
			previewImage: '',
			previewVisible: false,
		};
	}
	// 打开模态框
	showModal = () => {
		this.setState({
			modalVisible: true
		})
	}
	// 确定提交
	handleOk = () => {
		const { form } = this.props;
		const { fileList, currentType } = this.state;
		form.validateFields((err, fieldsValue) => {
			if (err) {
				return;
			}

			// 新增编辑
			const uploadContact = (code) => {

				if(!fieldsValue[currentType]) {
					fieldsValue[currentType] = null;
				}
				
				if(code){
					fieldsValue[currentType] = code;
				}

				return new Promise((resolve =>
					request(serviceApi.addEditReward,{
						method: 'post',
						data: fieldsValue
					}).then(res => {
						this.props.callback();
						message.success('成功')
						this.handleCancel();
						resolve();
					})
				))
			}

			// 判断封面是否更改
			if (fileList && fileList[0] && fileList[0].size) {
				uploadQiniu(fileList[0], uploadContact)
				return false;
			}

			uploadContact()
		})
	}

	// 取消 
	handleCancel = () => {
		this.setState({
			modalVisible: false,
			fileList: [],
			currentType: null
		})
	}

	edit = (code, currentType) => {
		this.setState({
			currentType,
			fileList: code && [{
				uid: new Date(),
				name: 'image.png',
				status: 'done',
				url: code,
			}],
		}, () => {
			this.showModal()
		})
	}

	// 解析为base64位 
	getBase64 = (img, callback) => {
		const reader = new FileReader();
		reader.addEventListener('load', () => callback(reader.result));
		// 读取文件
		reader.readAsDataURL(img);
	}

	// 图片预览
	handlePreview = file => {
		this.setState({
			previewImage: file.url || file.preview,
			previewVisible: true,
		});
	};

	render() {
		const { modalVisible, fileList, previewImage, previewVisible } = this.state;
		const { form, userInfo, isEdit, updateLoading } = this.props;
		const formLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 20 },
		}

		const updateProps = {
			onRemove: file => {
				this.setState(state => {
					const index = state.fileList.indexOf(file);
					const newFileList = state.fileList.slice();
					newFileList.splice(index, 1);
					return {
						fileList: newFileList,
					};
				});
			},
			beforeUpload: file => {
				const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
				if (!isJpgOrPng) {
					message.error('老铁你检查一下是不是JPG/PNG的图片文件!');
					return false
				}

				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					message.error('2MB以下!');
					return false
				}

				this.getBase64(file, (imageUrl) => {
					file.url = imageUrl
					this.setState({
						previewImage: imageUrl,
						fileList: [file],
					})
				});
				return false;
			},
			fileList: this.state.fileList
		};

		return (
			<div className="reward-box">
				<Popover placement="bottom" content={(
					<div className="re-code">
						{
							!isEdit ?
								<div className="re-code">
									{
										userInfo && userInfo.wxReward ?
											<img src={userInfo.wxReward} alt="" />
											: '暂无赞赏码'
									}
								</div>
								:
								<a onClick={() => this.edit(userInfo.wxReward, 'wxReward')}>编辑</a>
						}
					</div>
				)}>
					<IconFont className="reward-icon" type="iconwxpay" style={{ fontSize: 28, color: '#2bad13' }} />
				</Popover>

				<Popover placement="bottom" content={(
					<div className="re-code">
						{
							!isEdit ?
								<div className="re-code">
									{
										userInfo && userInfo.zfbReward ?
											<img src={userInfo.zfbReward} alt="" />
											: '暂无赞赏码'
									}
								</div>
								:
								<a onClick={() => this.edit(userInfo.zfbReward, 'zfbReward')}>编辑</a>
						}
					</div>
				)}>
					<IconFont className="reward-icon" type="iconzhifubao" style={{ fontSize: 28, color: '#00a3ee' }} />
				</Popover>

				<Modal
					title="赞赏码"
					width={500}
					destroyOnClose
					visible={modalVisible}
					okText="保存"
					onOk={this.handleOk}
					onCancel={() => { this.handleCancel(); form.resetFields() }}
					maskClosable={false}
					confirmLoading={updateLoading}
				>
					<Form onSubmit={this.handleOk}>
						<FormItem label="二维码" {...formLayout} className="update-code">
							<Upload.Dragger
								{...updateProps}
								name="files"
								listType="picture-card"
								onPreview={this.handlePreview}
								style={fileList && fileList.length >= 1 ? null : { padding: 18, border: '1px dashed #d9d9d9' }}
							>
								{fileList && fileList.length >= 1 ? null :
									<>
										<p className="ant-upload-drag-icon">
											<Icon type="picture" />
										</p>
										<p className="ant-upload-text">单击或拖动文件到此区域以上传</p>
										<p className="ant-upload-hint">只能上传限png、jpg 格式的图片，2m以下！</p>
									</>
								}
							</Upload.Dragger>

							<Modal visible={previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
								<img alt="example" style={{ width: '100%' }} src={previewImage} />
							</Modal>
						</FormItem>
					</Form>
				</Modal>


			</div>
		);
	}
};

const RewardForm = Form.create()(Reward);
export default RewardForm;
