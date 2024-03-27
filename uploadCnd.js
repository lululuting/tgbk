

/* eslint-disable no-undef */
const readline = require('readline');
const colors = require('colors');
const FS = require('fs');
const QiNiu = require('qiniu');
const path = require('path');

const accessKey = 'Ka5MwPh2DIoWY4HUKC6o4MC_qLp0pkSqr7y6JE2G'; // '{你的七牛云 AccessKey}'
const secretKey = 'qCQ-whh1GnijH2oCNTmqh3V6DbvIyOAcpOrf89ui'; // '{你的七牛云 SecretKey}'
const bucket = 'tingge-blog'; // '{你的 Bucket 名称}'
const prefix = '_next/static/'; // 七牛目录名称（前缀）


let uploadNore = ['index.html']; // 忽略文件数组（可以为文件或文件夹）忽略文件数组（可以为文件或文件夹）

// 鉴权对象
const mac = new QiNiu.auth.digest.Mac(accessKey, secretKey);
// 获取七牛配置
const config = new QiNiu.conf.Config();
// 是否使用https域名
// config.useHttpsDomain = true;
// 上传是否使用cdn加速
// config.useCdnDomain = true;
// 空间对应的机房 Zone_z2(华南) 不方便写入配置 这里要自己填写对应的机房
config.zone = QiNiu.zone.Zone_z2;

// 资源管理相关的操作首先要构建BucketManager对象
const bucketManager = new QiNiu.rs.BucketManager(mac, config);
// 相关颜色配置 console颜色主题
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// 这里采用异步方法操作 获取远程列表的目的只是为了删除 但只能是获取到列表后 回调里再删除
// 获取远程七牛 指定前缀 文件列表
async function getQiniuList () {

  let array = [];
  async function getList () {
    let options = {
      limit: 1000,
      prefix: prefix
    };
    return new Promise(function (resolve) {
      bucketManager.listPrefix(bucket, options, function (err, respBody, respInfo) {
        if (err) {
          console.log(err);
          throw err;
        }
        if (respInfo.statusCode == 200) {
          let items = respBody.items;
          items.forEach(function (item) {
            array.push(QiNiu.rs.deleteOp(bucket, item.key));
          });
          if (respBody.marker) {
            getList(respBody.marker);
          } else {
            resolve(array);
          }
        } else {
          console.log(respInfo.statusCode);
          console.log(respBody);
        }
      });
    });
  }
  return  await getList();
}

function del (deleteOperations, resolve) {
  bucketManager.batch(deleteOperations, function (err, respBody, respInfo) {
    if (err) {
      console.log(err);
      // throw err;
    } else {
      // 200 is success, 298 is part success
      if (parseInt(respInfo.statusCode / 100) == 2) {
        respBody.forEach(function (item, index) {
          if (item.code == 200) {
            resolve(index);
            console.log('删除成功' + '第' + (parseInt(index) + 1) + '个文件'.info);
          } else {
            console.log('删除失败'.error);
            console.log(item.code + '\t' + item.data.error.error);
            resolve(index);
          }
        });
      } else {
        console.log(respInfo.deleteusCode);
        console.log(respBody);
      }
    }
  });
}

// 批量删除远程七牛 指定列表 所有文件
async function delAll () {
  async function delQiniuAll () {
    return new Promise(function (resolve) {
      // 获取七牛远程列表数据
      getQiniuList().then(res => {
        if (res.length !== 0) {
          console.log('远程列表为空'.debug);
          del(res, resolve);
        } else {
          resolve();
        }
      });
    });
  }
  await delQiniuAll();
}

// 上传单文件到骑牛 localFile为本地完成路径+文件名称 key为远程 七牛目录文件名
function upOneToQiniu (localFile, key) {
  let mac = new QiNiu.auth.digest.Mac(accessKey, secretKey);
  let options = {
    scope: bucket,
    expires: 7200
  };
  let putPolicy = new QiNiu.rs.PutPolicy(options);
  let uploadToken = putPolicy.uploadToken(mac);


  let formUploader = new QiNiu.form_up.FormUploader(config);
  let putExtra = new QiNiu.form_up.PutExtra();

  try {
    // 文件上传
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode == 200) {
        console.log(localFile.info + '=>' + respBody.key.info + '上传成功');
      } else {
        console.log('上传失败' + respInfo.statusCode.error);
        console.log('上传失败' + respBody.error);
      }
    });

  } catch (err) {
    console.log(err);
  }
}


/**
 * 判断当前路径是否在忽略文件数组中
 * @param {String} path 路径
 */
function isNore (path) {
  for (let item of uploadNore) { // 遍历忽略数组
    if (path.indexOf(item) !== -1) {
      return false;
    }
  }
  return true;
}

// 拿到文件 目录路径 startPath 根目录名称
function findSync (startPath) {
  let targetObj = {};

  function finder (tpath) {
    // 获取当前目录下的 文件或文件夹
    let files = FS.readdirSync(tpath);
    // 循环获 当前目录下的所有文件
    files.forEach((val) => {
      let fPath = path.join(tpath, val);
      let stats = FS.statSync(fPath);
      if (stats.isDirectory()) {
        finder(fPath);
      }
      if (stats.isFile() && isNore(fPath)) {
        fPath = fPath.replace(/\\/g, '/');
        targetObj[fPath.replace(startPath, prefix)] = fPath;
      }
    });
  }
  finder(startPath);
  return targetObj;
}

// 上传所有文件到骑牛
function upAllToQiniu () {
  console.log('开时删除七牛远程资源列表'.debug);
  // 先删除所有 再上传
  delAll().then(() => {
    console.log('开时上传资源到七牛'.debug);
    // let files = FS.readdirSync('build/static/'); // 文件目录

    let localFile = findSync('build/static/');

    // key 为远程 七牛目录文件名
    // localFile[key] 为本地完成路径+文件名称
    for (let key in localFile) {
      // console.log(localFile)
      upOneToQiniu(localFile[key], key);
    }
  });
}

// 配合自动化部署脚本 上传cdn直接执行 不再需要询问
// process 对象是一个全局变量，它提供当前 Node.js 进程的有关信息，以及控制当前 Node.js 进程 因为是全局变量，所以无需使用 require()。
let rl = readline.createInterface({
  input: process.stdin, // 要监听的可读流
  output: process.stdout, // 要写入逐行读取数据的可写流
  prompt: ('是否进行远程部署> (Y/N)').warn
});
rl.prompt();
// 每当 input 流接收到接收行结束符（\n、\r 或 \r\n）时触发 'line' 事件。 通常发生在用户按下 <Enter> 键或 <Return> 键。监听器函数被调用时会带上一个包含接收的那一行输入的字符串。
rl.on('line', (line) => {
  switch (line.trim()) {
  case 'y':
  case 'Y':
    console.log('开始执行远程部署'.help);
    // 上传
    upAllToQiniu();
    rl.close();
    break;
  case 'n':
  case 'N':
    console.log('您取消了远程部署'.help);
    rl.close();
    break;
  default:
    console.log(`你输入的：'${line.trim()}'为无效命令，请重新输入`.warn);
    rl.prompt();
    break;
  }
});
