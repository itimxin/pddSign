# 拼多多api 多多进宝 多多客api sign签名生成方法(nodejs版)
## DEMO见: index.js
- 运行: 
1. npm i
2. node index.js
3. 浏览器访问: http://127.0.0.1:8888/
4. 得到 热销商品列表
## 主要代码
```
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
```
## 调用方式
```

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
```

参考链接: https://open.pinduoduo.com/#/document?url=https%253A%252F%252Fmai.pinduoduo.com%252Fautopage%252F84_static_9%252Findex.html

