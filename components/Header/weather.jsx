// 天气组件
// 数据由几个第三方接口拼接得来
import React from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import _ from 'lodash';
import { WarningOutlined } from '@ant-design/icons';
import WeatherIcon from './icon';
import styles from './weather.module.less';

const Weather = ({ weatherInfo, ipWeather, ipLong }) => {

  // 24小时 不同的7种天空颜色
  let hours = new Date().getHours();
  let skY = ['a5adf6', '1ab6ff', '028fff', 'ffa365', '141852', '000', '26282c'];
  let skX = ['9bc5ed', '94dbf8', '1ab6ff', 'fca739', '635df7', '444', '26282c'];

  let hX = '#';
  let color1 = '';
  let color2 = '';

  function skyCol (f) {
    color1 = hX + skY[f];
    color2 = hX + skX[f];
  }

  if (hours > 4 && hours < 7) {           // 5-6am - early morning
    skyCol(0);
  } else if (hours > 6 && hours < 9) {    // 7-8 am - morning
    skyCol(1);
  } else if (hours > 8 && hours < 17) {   // 9am-4pm day - noon
    skyCol(2);
  } else if (hours > 16 && hours < 19) {  // 5pm-6pm
    skyCol(3);
  } else if (hours > 19 && hours < 22) {  // 8pm-9pm
    skyCol(4);
  } else if (hours > 21 || hours < 5) {   // 10pm-4am
    skyCol(5);
  } else {
    skyCol(6);
  }


  // {/* sunny 太阳 fine 太阳加云  cloudy 单云 cloudys 多云  rainy 下雨 stormy 雷雨 thunder 雷 starry 月亮  snowy 下雪 breeze 微风  fog 雾  haze 薄雾*/}

  const animCode = (code) => {
    const anim = {
      sunny: [100],
      fine: [101, 102, 103],
      cloudys: [104, 151, 152, 153],
      rainy: [300, 301, 305, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318, 350, 351, 1035, 1038],
      stormy: [302, 303, 304, 2024],
      thunder: [1014, 1043],
      starry: [150],
      snowy: [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 456, 457, 499]
    };

    let name = null;
    for (let key in anim) {
      if (anim[key].includes(code * 1))  {
        name = key;
      }
    }
    return name;

  };


  return (
    <div className={styles['weather-content']}>
      {weatherInfo?.now ? (
        <div className={styles['weather-box']}>
          <div className={styles['info1']}>
            <div className={styles['left']}>
              <div className={styles['temp']}>
                {_.get(weatherInfo, 'now.temp')}
                <span style={{ fontSize: 16, fontWeight: 300, color: '#666' }}>
                  ℃
                </span>
              </div>
              <div className={styles['address']}>
                {_.get(ipWeather, 'address_detail.city', '城市')}
                <div className={styles['temp-text']}>
                  {_.get(weatherInfo, 'daily[0].tempMin')}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 300,
                      color: '#999',
                      marginTop: 2
                    }}
                  >
                    ℃
                  </span>
                  <span style={{ margin: '0 5px' }}>-</span>
                  {_.get(weatherInfo, 'daily[0].tempMax')}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 300,
                      color: '#999',
                      marginTop: 2
                    }}
                  >
                    ℃
                  </span>
                </div>
              </div>
              <p className={styles['trend']}>{_.get(weatherInfo, 'summary')}</p>
            </div>

            <div className={styles['right']} style={{background: `linear-gradient(${color1} 0, ${color2} 100%)`, boxShadow: `0 0 10px ${color1}`}}>
              {
                animCode(weatherInfo?.now?.icon)
                  ? (
                    <div className={styles[animCode(weatherInfo?.now?.icon)]}>
                      <i></i>
                    </div>
                  )
                  : (
                    <WeatherIcon code={weatherInfo?.now?.icon} size={140} style={{color: '#fff'}} />
                  )
              }
            </div>
          </div>

          {/* 只取第一条最新的警告  */}
          {_.get(weatherInfo, 'warning[0]') ? (
            <div className={styles['warning-box']}>
              <WarningOutlined
                type="warning"
                style={{ marginRight: 10, color: '#ff4d4f', fontSize: 18 }}
              />
              <div className={styles['warning']}>
                {_.get(weatherInfo, 'warning[0].text')}
              </div>
            </div>
          ) : null}

          <div className={styles['info2']}>
            <div className={styles['option']}>
              <div className={styles['item']}>
                <p className={styles['tit']}>日出日落</p>
                <p className={styles['con']}>
                  {moment(_.get(weatherInfo, 'sunmoon.sunrise')).format(
                    'HH:mm'
                  )}
                  -
                  {moment(_.get(weatherInfo, 'sunmoon.sunset')).format('HH:mm')}
                </p>
              </div>
              <div className={styles['item']}>
                <p className={styles['tit']}>湿度</p>
                <p className={styles['con']}>{_.get(weatherInfo, 'now.humidity')}%</p>
              </div>
            </div>
            <div className={styles['option']}>
              <div className={styles['item']}>
                <p className={styles['tit']}>风速</p>
                <p className={styles['con']}>
                  {weatherInfo.now.windDir}{' '}
                  {_.get(weatherInfo, 'now.windScale')}级
                </p>
              </div>
              <div className={styles['item']}>
                <p className={styles['tit']}>气压</p>
                <p className={styles['con']}>{_.get(weatherInfo, 'now.pressure')}hpa</p>
              </div>
            </div>
          </div>

          {/* 天气实况图 */}
          {ipLong ? (
            <iframe
              width="400"
              height="150"
              src={`https://embed.windy.com/embed2.html?lat=${ipLong.adlat}&lon=${ipLong.adlng}&detailLat=34.069&detailLon=-118.323&width=380&height=200&zoom=10&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1`}
              frameBorder="0"
            ></iframe>
          ) : null}

          <div className={styles['info3']}>
            <div className={styles['future']}>
              <div className={styles['title']}>未来7小时</div>
              <ul className={styles['list']}>
                {_.map(
                  _.get(weatherInfo, 'hourly', []).slice(0, 7),
                  (item, index) => {
                    return (
                      <li className={styles['item']} key={index}>
                        <WeatherIcon code={item.icon} />
                        <div className={styles['temp']}>{item.temp}</div>
                        <div className={styles['time']}>
                          {moment(item.fxTime).format('HH')}时
                        </div>
                      </li>
                    );
                  }
                )}
              </ul>
            </div>

            <div className={styles['future']}>
              <div className={styles['title']}>未来7天</div>
              <ul className={styles['list']}>
                {_.map(_.get(weatherInfo, 'daily', []), (item, index) => {
                  return (
                    <li className={styles['item']} key={index}>
                      <WeatherIcon code={item.iconDay} />
                      <div className={styles['temp']}>{item.tempMax}</div>
                      <div className={styles['time']}>
                        {moment(item.fxDate).format('dddd')}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <p
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: '#999',
              margin: '20px 0 10px'
            }}
          >
            挺哥预报 & 和风天气 - 实况天气推送：{' '}
            {moment(_.get(weatherInfo, 'updateTime')).startOf('min').fromNow()}
          </p>
        </div>
      ) : (
        <Spin tip="祈祷中..." />
      )}
    </div>
  );
};

export default Weather;
