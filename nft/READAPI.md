#### 首页banners

###### api/banners
method: GET
请求参数 {}

返回:

```javascript

{
    code: 10000,
    message: 'sucess',
    data: {
        records: [{
            levels: '1',  // 盲盒等级 钻石 1， 白金 2， 黄金 3，白银 4，青铜 5
            coins: [{
                name: 'ETH', //可开出代币名称
                amount: 100, //可开出代币数量
            }，{
                name: 'BTC', //可开出代币名称
                amount: 100, //可开出代币数量
            }], //可开出代币
            // ...其余可能需要数据
        }]
    }

}

```

#### 领取盲盒接口

###### api/receive
method: 
请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}
```

返回： 

> 目前应该是一次只能领取一个吧？

```javascript
{
    code: 10000, //成功code码 失败： 例如10001等
    message: 'sucess', //sucess fail
    data: {
        id: 1, //盲盒id,
        level: 1, //盲盒等级 钻石 1， 白金 2， 黄金 3，白银 4，青铜 5
        last_times: '5', //剩余领取次数
        private_key: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的私钥
    }

}

```

#### 我的宝库

###### api/myboxs
method:

请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}

```

返回：

```javascript
{
    code: 10000, //成功code码 失败： 例如10001等
    message: 'sucess', //sucess fail
    data: {
        records: [{
            id: 1, //盲盒id,
            level: '1', // 盲盒等级 
            private_key: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的私钥
            // ...其余可能需要数据
        },{
            id: 1, //盲盒id,
            level: '1', // 盲盒等级 
            private_key: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的私钥

            // ...其余可能需要数据
        }],
    }

}
```

