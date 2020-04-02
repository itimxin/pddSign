
const http = require('http');
const request = require('request');
const md5 = require('js-md5');
// 拼多多apiURL https://open.pinduoduo.com/#/apidocument?docId=12
const PDD_BASEURL = 'https://gw-api.pinduoduo.com/api/router'
// client_id client_secret https://open.pinduoduo.com/#/application/
const CLIENT_ID = '8547745aab854d1b93070bfd2a919ab7'
const CLIENT_SECRET = '8342d781dd5f2d28f19a7dc7ac5f20dc1a6cac25'
/**
 * sign签名生成 
 * @param {Object} arrayParam {type:必填,...}
 */
const signGet = async (arrayParam)=>{
  return new Promise(async (resolve,reject) => {
    // 补充固定字段
    arrayParam.client_id = CLIENT_ID
    arrayParam.timestamp = (new Date()).valueOf()
    // 排序:字母升序
    let arr = []
    for(let key in arrayParam){
      arr.push(key)
    }
    arr.sort()
    // console.log('arr: ',arr)
    // 拼接字符串
    let strSign = CLIENT_SECRET
    for(let item of  arr){
      strSign+=`${item}${arrayParam[item]}`
    }
    strSign+=CLIENT_SECRET
    // md5加密
    strSign = md5(strSign)
    strSign = strSign.toUpperCase()
    // console.log('strSign: ',strSign)
    // 拼接url
    let url = `${PDD_BASEURL}?sign=${strSign}`
    for(let key in arrayParam){
      url+=`&${key}=${arrayParam[key]}`
    }
    resolve(url)
  })
}


/**
 * pdd.ddk.top.goods.list.query
    获取热销商品列表
 */
const hotGet = async ()=>{
  return new Promise(async (resolve,reject) => {
    let type = 'pdd.ddk.top.goods.list.query'
    let url = await signGet({
      type
    })
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body)
        resolve(JSON.stringify(body))
      }
    })
  })
}

http.createServer(async function (request, response) {

    // 发送 HTTP 头部 
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});
  
    let res = await hotGet()

    response.end(res);
}).listen(8888);

// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');
