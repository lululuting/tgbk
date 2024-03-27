/*
 * @Date: 2020-04-13 16:05:15
 * @LastEditors: TingGe
 * @LastEditTime: 2022-05-26 00:30:35
 * @FilePath: /ting_ge_blog/components/Aplayer/index.jsx
 * 插件具体详情 https://aplayer.js.org/#/zh-Hans/
 */
import React, { useEffect } from 'react';
import request from '@/public/utils/request';
import serviceApi from '@/config/service';
import { loadScript } from '@/public/utils/utils';
import './style.less';

// props.id 网易云的歌单id
// 查看方法是登录你的网易云网页版 点击你的歌单 查看url上的参数
const Aplayer = (props) => {
  useEffect(() => {
    loadScript(
      'https://unpkg.com/aplayer@1.10.1/dist/APlayer.min.js',
      () => {
        request(serviceApi.getMusicList, {
          method: 'get',
          params: {
            id: props.id
          }
        }).then((res) => {
          if (!res.data || !res.data || !res.data.length) return;

          const ap = new window.APlayer({
            container: document.getElementById('player'),
            mini: true,
            fixed: true,
            autoplay: false,
            loop: 'all',
            order: 'list',
            preload: 'auto',
            volume: 0.7,
            mutex: true,
            listFolded: true,
            listMaxHeight: 90,
            lrcType: 1,
            audio: res.data
          });

          ap.lrc.hide(); // 隐藏歌词

          // 自适应颜色背景皮肤
          loadScript(
            'https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.min.js',
            () => {
              const colorThief = new window.ColorThief();

              const setTheme = (index) => {
                if (!ap.list.audios[index].theme) {
                  colorThief.getColorAsync(
                    ap.list.audios[index].cover,
                    function (color) {
                      ap.theme(
                        `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
                        index
                      );
                    }
                  );
                }
              };

              setTheme(ap.list.index);
              ap.on('listswitch', ({ index }) => {
                setTheme(index);
              });
            }
          );
        });
      }
    );
  }, []);

  return <div id="player"> </div>;
};

export default Aplayer;
