#### 首页banners

##### api/banners
method: GET
请求参数 {}

返回:

```javascript

{
    code: 10000,
    message: 'success',
    data: {
        records: [{
            level: '1',  // 盲盒等级 钻石 1， 白金 2， 黄金 3，白银 4，青铜 5
            tokens: [{
                name: "Ethereum",可开出代币名称
                symbol: 'ETH', //可开出代币符号
                amount: 100, //可开出代币数量
            }，{
                name: "Bitcoin",//可开出代币名称
                symbol: 'BTC', //可开出代币符号名称
                amount: 100, //可开出代币数量
            }], //可开出代币
            // ...其余可能需要数据
        }]
    }

}

```
###### 示例
* 请求
```
curl https://box.hoosmartchain.com/api/banners

```

* 应答
···
{
  "code": 10000,
  "message": "success",
  "data": {
    "records": [
      {
        "level": 1,
        "tokens": [
          {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "0.607"
          },
          {
            "name": "Lendoo",
            "symbol": "LENDOO",
            "amount": "6.072"
          },
          {
            "name": "HeshiSwap",
            "symbol": "HESHISWAP",
            "amount": "0.00607"
          },
          {
            "name": "SwapAll",
            "symbol": "SWAPALL",
            "amount": "0.607"
          }
        ]
      },
      {
        "level": 2,
        "tokens": [
          {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "0.809"
          },
          {
            "name": "Lendoo",
            "symbol": "LENDOO",
            "amount": "8.097"
          },
          {
            "name": "HeshiSwap",
            "symbol": "HESHISWAP",
            "amount": "0.00809"
          },
          {
            "name": "SwapAll",
            "symbol": "SWAPALL",
            "amount": "0.809"
          }
        ]
      },
      {
        "level": 3,
        "tokens": [
          {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "1.619"
          },
          {
            "name": "Lendoo",
            "symbol": "LENDOO",
            "amount": "16.194"
          },
          {
            "name": "HeshiSwap",
            "symbol": "HESHISWAP",
            "amount": "0.01619"
          },
          {
            "name": "SwapAll",
            "symbol": "SWAPALL",
            "amount": "1.619"
          }
        ]
      },
      {
        "level": 4,
        "tokens": [
          {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "2.024"
          },
          {
            "name": "Lendoo",
            "symbol": "LENDOO",
            "amount": "20.242"
          },
          {
            "name": "HeshiSwap",
            "symbol": "HESHISWAP",
            "amount": "0.02024"
          },
          {
            "name": "SwapAll",
            "symbol": "SWAPALL",
            "amount": "2.024"
          }
        ]
      },
      {
        "level": 5,
        "tokens": [
          {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "4.048"
          },
          {
            "name": "Lendoo",
            "symbol": "LENDOO",
            "amount": "40.485"
          },
          {
            "name": "HeshiSwap",
            "symbol": "HESHISWAP",
            "amount": "0.04048"
          },
          {
            "name": "SwapAll",
            "symbol": "SWAPALL",
            "amount": "4.048"
          }
        ]
      }
    ]
  }
}
···

#### 领取盲盒接口

###### api/claimbox
method: POST
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
    message: 'success', //success fail
    data: {
        level: 1, //盲盒等级 钻石 1， 白金 2， 黄金 3，白银 4，青铜 5
        last_times: '5', //剩余领取次数
        address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的地址
    }

}

```
###### 示例
* 请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     https://box.hoosmartchain.com/api/claimbox

0x187E9C0A52742604690eD1647E130e7616146b08

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x187E9C0A52742604690eD1647E130e7616146b08"}}' \
     https://box.hoosmartchain.com/api/claimbox
```
* 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "address": "0x97c6a2e2a8b0260c756B351bBb8D7a733585eD1c",
    "last_times": 1146,
    "level": 4
  }
}
```

##### 我的宝库

###### api/myboxes
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
    message: 'success', //success fail
    data: {
        records: [{
            id: 1, //盲盒id,
            level: '1', // 盲盒等级 
            address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的地址
            // ...其余可能需要数据
        },{
            id: 1, //盲盒id,
            level: '1', // 盲盒等级 
            address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //开启盲盒的地址

            // ...其余可能需要数据
        }],
    }

}
```

#### 示例

* 请求
```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"myboxes","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     https://box.hoosmartchain.com/api/myboxes

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"myboxes","params":{"address":"0x187E9C0A52742604690eD1647E130e7616146b08"}}' \
     https://box.hoosmartchain.com/api/myboxes


```

* 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "records": [
      {
        "boxAddress": "0xD3B912Be05213fCeee58fd5071bDA164F8fd45f3",
        "level": 3
      },
      {
        "boxAddress": "0xD0874c0ccf6A320A25147bbc02Af67733efFC236",
        "level": 3
      }
    ]
  }
}
```




####  打开盲盒接口

###### api/openbox
method: POST
请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //盲盒地址
}
```

返回： 

> 目前应该是一次只能打开一个

```javascript
{
    code: 10000, //成功code码 失败： 例如10001等
    message: 'success', //success fail
    data: {
            {
            "name": "PuddingSwap",
            "symbol": "PUDDINGSWAP",
            "amount": "0.607"
            },
            ...
    }
}

```
###### 示例
* 请求
  
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"openbox","params":{"address":"0xE1cdCB6C6B69e03d210B0Cfa49270F7f0D5EC243"}}' \
     https://box.hoosmartchain.com/api/openbox
```
* 应答
  
```
{
  "code": 10000,
  "message": "success",
  "data": [
    {
      "name": "PuddingSwap",
      "symbol": "PUDDINGSWAP",
      "amount": "0.607"
    },
    {
      "name": "Lendoo",
      "symbol": "LENDOO",
      "amount": "6.072"
    },
    {
      "name": "HeshiSwap",
      "symbol": "HESHISWAP",
      "amount": "0.00607"
    },
    {
      "name": "SwapAll",
      "symbol": "SWAPALL",
      "amount": "0.607"
    }
  ]
}
```
