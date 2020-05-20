/*
 * @Date: 2020-04-13 16:05:15
 * @LastEditors: 挺哥
 * @LastEditTime: 2020-05-17 14:20:22
 * @FilePath: \ting_ge_blog\components\Aplayer\index.js
 */
import React, { useEffect } from 'react';
import request from '@/public/utils/request'
import { loadScript } from '@/public/utils/utils'
import './style.less'

// props.id 网易云的歌单id 
// 查看方法是登录你的网易云网页版 点击你的歌单 查看url上的参数
const Aplayer = (props) => {

    const fetch163Playlist = (playlistId) => {
        return new Promise((ok, err) => {
            request(`https://v1.hitokoto.cn/nm/playlist/${playlistId}`)
                .then(data => {
                    let arr = [];
                    data && data.privileges && data.privileges.map(function (value) {
                        arr.push(value.id);
                    });
                    return arr;
                })
                .then((arr) => {
                    let list = fetch163Songs(arr)
                    ok(list)
                })
                .catch(err);
        });
    }


    const fetch163Songs = (Ids) => {
        return new Promise(function (ok, err) {
            let ids;
            switch (typeof Ids) {
                case 'number':
                    ids = [Ids];
                    break;
                case 'object':
                    if (!Array.isArray(Ids)) {
                        err(new Error('Please enter array or number'));
                        return;
                    }
                    ids = Ids;
                    break;
                default:
                    err(new Error('Please enter array or number'));
                    return;
                    break;
            }
            request(`https://v1.hitokoto.cn/nm/summary/${ids.join(',')}?lyric=true&common=true`)
                .then(data => {
                    var songs = [];
                    data && data.songs && data.songs.map(function (song) {
                        songs.push({
                            name: song.name,
                            url: song.url,
                            artist: song.artists.join('/'),
                            album: song.album.name,
                            pic: song.album.picture,
                            lrc: song.lyric.translate || song.lyric.base
                        });
                    });
                    return songs;
                })
                .then(ok)
                .catch(err);
        });
    }

    useEffect(() => {
        loadScript('https://cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.js', () => {
            fetch163Playlist(props.id).then((data) => {
                const ap = new APlayer({
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
                    audio: data
                });

                ap.lrc.hide() // 隐藏歌词


                loadScript('https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.3.0/color-thief.min.js', () => {
                    const colorThief = new ColorThief();
                    
                    const setTheme = (index) => {
                        if (!ap.list.audios[index].theme) {
                            colorThief.getColorAsync(ap.list.audios[index].cover, function (color) {
                                ap.theme(`rgb(${color[0]}, ${color[1]}, ${color[2]})`, index);
                            });
                        }
                    };
                    
                    setTheme(ap.list.index);
                    ap.on('listswitch', ({index}) => {
                        setTheme(index);
                    });
                })

            });
        })
    }, [])

    return (
        <div id="player"></div>
    )
}


export default Aplayer