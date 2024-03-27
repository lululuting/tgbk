/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-06-06 17:44:04
 * @LastEditors: TingGe
 * @Description: 赞赏码展示组件
 * @FilePath: /ting_ge_blog/components/Reward/index.jsx
 */

import React, { useState } from 'react';
import { Modal, Divider, Radio } from 'antd';
import IconFont from '@/components/IconFont';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import SvgIcon from '@/components/SvgIcon';
import styles from './style.module.less';

const Reward = (props) => {
  const [visible, setVisible] = useState(false);
  const [selectType, setSelectType] = useState(0);
  const [rewardCode, setRewardCode] = useState(null);

  const  noTips = '博主还没有设置此类型的赞'

  const rewardClick = () => {
    request(serviceApi.getRewardCode, {
      method: 'get',
      params: { id: props.userId }
    }).then((res) => {
      if (res?.code === 200) {
        setRewardCode(res.data[0]);
        setVisible(true);
      }
    });
  };

  return (
    <>
      <Divider style={{ marginTop: 50 }} />
      <div className={styles['reward']}>
        <p className={styles['tips']}>“请博主喝一杯？，鼓励一下？”</p>
        <div
          onClick={rewardClick}
          className={styles['reward-btn']}
        >
          <SvgIcon name="iconhongbao"/>
          赞赏支持
        </div>
      </div>

      <Modal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        footer={null}
        width={300}
        className={styles['reward-modal']}
      >
        <div className={styles['reward-code-box']}>
          {selectType == 0 ? (
            rewardCode && rewardCode.wxReward ? (
              <img src={rewardCode.wxReward} />
            ) : (
              noTips
            )
          ) : rewardCode && rewardCode.zfbReward ? (
            <img src={rewardCode.zfbReward} />
          ) : (
            noTips
          )}
        </div>
        <div className={styles['action-box']}>
          <Radio.Group
            onChange={(e) => setSelectType(e.target.value)}
            value={selectType}
          >
            <Radio value={0} style={{ marginRight: 20 }}>
              <span className={styles['wx']}>
                <IconFont type="iconwxpay" style={{ fontSize: 28 }} /> 微信
              </span>
            </Radio>
            <Radio value={1}>
              <span className={styles['zfb']}>
                <IconFont type="iconzhifubao" style={{ fontSize: 28 }} /> 支付宝
              </span>
            </Radio>
          </Radio.Group>
        </div>
      </Modal>
    </>
  );
};
export default Reward;
