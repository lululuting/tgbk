/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2021-02-25 23:35:41
 * @LastEditors: TingGe
 * @Description: 赞赏码展示组件
 * @FilePath: /ting_ge_blog/components/Reward/index.jsx
 */

import React, { useState } from 'react'
import { Button, Modal, Divider, Radio } from 'antd'
import IconFont from '@/components/IconFont'
import request from '@/public/utils/request'
import serviceApi from '@/config/service'
import{
	RedEnvelopeOutlined
} from '@ant-design/icons';
import './style.less'

const Reward = (props) => {
	const [visible, setVisible] = useState(false)
	const [selectType, setSelectType] = useState(0)
	const [rewardCode, setRewardCode] = useState(null)

	const rewardClick = () => {
		request(serviceApi.getRewardCode, {
			method: 'get',
			params: { id: props.userId }
		}).then((res) => {
			if (res.code == 200) {
				setRewardCode(res.data[0])
				setVisible(true)
			}
		})
	}

	return (
		<>
			<Divider style={{ marginTop: 50 }} />
			<div id="reward">
				<p style={{ color: '#777' }}>“请博主喝一杯，支持一下”</p>
				<Button type="primary" size="large" icon={<RedEnvelopeOutlined />} onClick={rewardClick}>赞赏支持</Button>
			</div>

			<Modal
				visible={visible}
				onCancel={() => { setVisible(false) }}
				footer={null}
				width={300}
				className="reward-modal"
			>
				<div className="reward-code-box">
					{
						selectType == 0 ?
							rewardCode && rewardCode.wxReward ?
								<img src={rewardCode.wxReward} />
								: '博主还没有设置此类型的赞赏码'
							:
							rewardCode && rewardCode.zfbReward ?
								<img src={rewardCode.zfbReward} />
								: '博主还没有设置此类型的赞赏码'
					}
				</div>
				<div className="action-box">
					<Radio.Group onChange={(e) => setSelectType(e.target.value)} value={selectType}>
						<Radio value={0} style={{ marginRight: 20 }}>	<span className="wx"><IconFont type="iconwxpay" style={{ fontSize: 28 }} /> 微信</span></Radio>
						<Radio value={1}><span className="zfb"><IconFont type="iconzhifubao" style={{ fontSize: 28 }} /> 支付宝</span></Radio>
					</Radio.Group>
				</div>
			</Modal>
		</>
	)
}
export default Reward