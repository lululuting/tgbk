/*
 * @Author: TingGe
 * @Date: 2021-01-15 09:51:42
 * @LastEditTime: 2023-05-09 15:50:18
 * @LastEditors: TingGe
 * @Description: 白噪音
 * @FilePath: /ting_ge_blog/components/TingggeFm/index.jsx
 */

import React, { useEffect, useState } from 'react';
import { Radio } from 'antd';
import _ from 'lodash';
import IconFont from '@/components/IconFont';
import BScroll from 'better-scroll';
import classnames from 'classnames';
import fmDate from './FMlist';
import { PlayCircleOutlined } from '@ant-design/icons';
import './style.less';

const TingggeFm = () => {

  const [activeIds, setActiveIds] = useState([]);
  const [activeType, setActiveType] = useState('a');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    let wrapper = document.querySelector('.fm-list');
    new BScroll(wrapper, {
      scrollY: true,
      scrollX: false,
      click: true,
      mouseWheel: true,
      scrollbar: {
        fade: true,
        interactive: true,
        scrollbarTrackClickable: true
      }
    });
  }, []);

  const audioPlay = (url, id) => {
    let Fm;
    if (activeType === 'a') {
      Fm = document.getElementById('FM-Audio');
    } else {
      Fm = document.getElementById(`FM-Audio-${id}`);
    }

    if (Fm.paused) {
      Fm.src = url;
      Fm.play();
    } else {
      if (url === decodeURI(Fm.src)) {
        Fm.pause();
      } else {
        Fm.src = url;
        Fm.play();
      }
    }
  };

  // 点击播放/取消
  const play = (url, id) => {
  // 模式
    const index = activeIds.indexOf(id);
    let arr = JSON.parse(JSON.stringify(activeIds));
    arr.splice(index, 1);
    audioPlay(url, id);
    if (activeType === 'a') {
      if (index > -1) {
        setActiveIds([]);
        setDisabled(true);
      } else {
        setActiveIds([id]);
        setDisabled(false);
      }
    } else {
      if (index > -1) {
        setActiveIds(arr);
        if (!arr.length) {
          setDisabled(true);
        }
      } else {
        setActiveIds([...activeIds, id]);
        setDisabled(false);
      }
    }
  };

  // 点击播放/暂停
  const clickPlay = () => {
    setActiveIds([]);
    setDisabled(true);

    if (activeType === 'a') {
      let Fm = document.getElementById('FM-Audio');
      if (Fm && !Fm.paused) {
        Fm.pause();
      }

    } else {
      if (!activeIds.length) return;
      activeIds.map(item => {
        let Fm = document.getElementById(`FM-Audio-${item}`);
        if (Fm && !Fm.paused) {
          Fm.pause();
        }
      });
    }
  };


  // 单/混
  const changeType = (e) => {
    setActiveType(e.target.value);
    let Fm = document.getElementById('FM-Audio');
    if (Fm && !Fm.paused) {
      Fm.pause();
      Fm.src = null;
    } else {
      Fm.src = null;
    }

    activeIds.length && activeIds.map(item => {
      let Fm1 = document.getElementById(`FM-Audio-${item}`);
      if (Fm1 && !Fm1.paused) {
        Fm1.pause();
        Fm1.src = null;
      }
    });
    setActiveIds([]);
    setDisabled(true);
  };

  return (
    <div id="fm-box">
      <div className="info-header">
        <div className={classnames('status-box', { 'disabled': disabled })} disabled>
          {
            _.isEmpty(activeIds)
              ? (
                <>
                  <IconFont
                    type="iconshushuye"
                    style={{ fontSize: 24 }}
                  />TGFM
                </>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={clickPlay}>
                  <PlayCircleOutlined style={{ cursor: 'pointer', fontSize: 30, marginRight: 10 }} /> 暂停
                </div>
              )
          }
        </div>

        <Radio.Group onChange={changeType} defaultValue="a" buttonStyle="solid">
          <Radio.Button value="a">单音</Radio.Button>
          <Radio.Button value="b">混合</Radio.Button>
        </Radio.Group>
      </div>

      <div className="fm-list">
        <ul className="content">
          {
            _.map(fmDate, (item)=>{
              return (
                <li
                  onClick={() => play(`//cdn.lululuting.com/voice/${item.name}.mp3`, item.id)}
                  key={item.id}
                  className={classnames('fm-item', { 'active': activeIds.indexOf(item.id) > -1 })}
                >
                  {item.name}
                  <audio id={`FM-Audio-${item.id}`}></audio>
                </li>
              );
            })
          }
        </ul>
      </div>
      <p style={{ fontSize: 12, textAlign: 'center', color: '#999', margin: '20px 0 10px' }}>
				TGFM & 元气FM
      </p>
      <audio id="FM-Audio"></audio>
    </div>
  );
};


export default TingggeFm;
