

#### 领取徽章接口

###### api/claimbadge
method: POST
请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}
```

返回： 

> 目前应该是一次只能领取一个

```javascript
{
    code: 10000, //成功code码 失败：   10001 已领过  10002 领完
    message: 'success', //success fail
    data: {
        tokenid: '1', //徽章的地址
    }

}

```
###### 示例
* 请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     https://nft.hoosmartchain.com/api/claimbadge
```
* 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "tokenId": '1'
  }
}
```

##### 我的徽章

###### api/mybadge
method:Post

请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}

```

返回：

```javascript
{
    code: 10000, //成功code码 失败： 例如10001等   10001 没有领取过，10002 领过，被转走    10003  领取被转，接收到其他
    message: 'success', //success fail
    data: {
            tokenid: 1 //徽章id,
    }
}
```

#### 示例

* 请求
```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"mybadge","params":{"address":"0x5ba2A8748981c3B2C150c2d7aF391B104E399ACb"}}' \
     https://nft.hoosmartchain.com/api/mybadge


```

* 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "tokenId":1
  }
}
```

##### 是否领取完成

###### api/ismaxtotalsupply
method: Get

请求参数：
无

返回：

```javascript
{
  "code": 10000,
  "message": "success",
  "data": {
    "flag": false    true  结束  false 未结束 
  }
}

#### 示例

* 请求
```
curl  https://nft.hoosmartchain.com/api/ismaxtotalsupply
```

* 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "flag": false
  }
}
```
