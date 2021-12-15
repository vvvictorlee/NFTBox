



## Gas Fee 报告接口
* 总消耗量
* 消耗项目明细-一不同项目占比
* 消耗类别明细-一不同消耗方式占比
* 
### api/gasfeereport
#### method: POST
#### 请求参数：
```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}
```

#### 返回： 

```javascript
{
    code: 10000, //成功code码 失败：   10001 已领过  10002 领完  10003 IP 请求过
    message: 'success', //success fail
    data: {
        tokenid: '1', //徽章的地址
    }

}

```
#### 示例
##### 请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"gasfeereport","params":{"address":"0xc19d04e8fe2d28609866e80356c027924f23b1a5"}}' \
     https://graphapi.hoosmartchain.com/myapi/api/gasfeereport/
```


##### 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
      "totalgased": [
        {
          "_id": "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
          "gasedhoo": 0.95529290125983
        }
      ],
      "gasedbycontract": [
        {
          "_id": "other",
          "gased": 0.9552929012598301
        }
      ],
      "gasedbymethod": [
        {
          "_id": "other",
          "gased": 0.95529290125983
        }
      ]
  }
}
```

## 交互报告
* 年度总交互次数
* 交互项目明细。- 不同项目占比
* 第一次与HSC的交互：   您在2021年5月19日第一次参与到HSC，第一次参与的项目是PuddingSwap
* 该用户最晚一次交互是在什么时间及什么项目（您最晚一次参与的项目是 PuddingSwap）
* 交互时间明细   -基于不同时段

### api/interactivereport
#### method:Post
#### 请求参数：

```javascript
params: {
    address: '0xA2E21fD9F96CBa00f088c48858c3BaEf3e00cb5C', //hsc账户地址
}

```

#### 返回：

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

##### 请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"interactivereport","params":{"address":"0xc19D04E8Fe2d28609866e80356c027924F23B1A5","year":"2021","range":"6"}}' \
     https://graphapi.hoosmartchain.com/myapi/api/interactivereport/


```

#####  应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "total": 9429,
    "firstlast": [
      {
        "_id": "61b6fa0f202498093e12996f",
        "blockNumber": "29141",
        "timeStamp": "1619844892",
        "hash": "0xe8980b2a408f62f8847494de21ce841fa6d648f01d687fe9bf09732a25563946",
        "nonce": "0",
        "blockHash": "0x5266d42be6302a1dec38b4153d8fb43585d0dbe0bb085c2b62c8d39836023567",
        "transactionIndex": "0",
        "from": "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
        "to": "0xd16babe52980554520f6da505df4d1b124c815a7",
        "value": "0",
        "gas": "2000000",
        "gasPrice": "1000000000",
        "isError": "0",
        "txreceipt_status": "1",
        "contractAddress": "",
        "cumulativeGasUsed": "52333",
        "gasUsed": "52333",
        "confirmations": "6512191"
      },
      {
        "_id": "61b6fb1d104bf00a050d22f9",
        "blockNumber": "172006",
        "timeStamp": "1620273487",
        "hash": "0x495a11b1d624af528f5661b6c1b1ab34efe1bc88c6880a396b953503a2962311",
        "nonce": "9428",
        "blockHash": "0xeeb1fcae73591caf5f17820ec2a7fd1a7d870ad7b665dadbdb9e55a11ddaec49",
        "transactionIndex": "4",
        "from": "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
        "to": "0xc19d04e8fe2d28609866e80356c027924f23b1a5",
        "value": "1185010050000000000000",
        "gas": "2000000",
        "gasPrice": "2000000000",
        "isError": "0",
        "txreceipt_status": "1",
        "contractAddress": "",
        "cumulativeGasUsed": "549561",
        "gasUsed": "21000",
        "confirmations": "6369415"
      }
    ],
    "txcountbyapp": [
      {
        "_id": [
          "appname"
        ],
        "times": 9
      },
      {
        "_id": "other",
        "times": 9420
      }
    ],
    "txcountbytimespan": [
      {
        "_id": 3,
        "times": 1177
      },
      {
        "_id": 5,
        "times": 1412
      },
      {
        "_id": 4,
        "times": 1556
      },
      {
        "_id": 0,
        "times": 1180
      },
      {
        "_id": 1,
        "times": 2685
      },
      {
        "_id": 2,
        "times": 1419
      }
    ]
  }
}
```


##  资产报告
* 年度投入代币情况及总价值
* 每月投入代币情况及总价值
### api/assetreport
#### method: Post
#### 请求参数：
无

#### 返回：

```javascript
{
  "code": 10000,
  "message": "success",
  "data": {
    "flag": false    true  结束  false 未结束 
  }
}
```

#### 示例

##### 请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"assetreport","params":{"address":"0xc19d04e8fe2d28609866e80356c027924f23b1a5","year":"2021"}}' \
     https://graphapi.hoosmartchain.com/myapi/api/assetreport/

```

##### 应答
```
{
  "code": 10000,
  "message": "success",
  "data": {
    "total": [],
    "months": [
      {
        "_id": [
          "0xd8f6d61c2cc69c04f176616ad1c7de211b00af31",
          12
        ],
        "amount": "2917267.968497967236814442",
        "amountvalue": "2917267968497967236814442",
        "tokenName": "LOOT",
        "tokenSymbol": "LOOT",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xe9fb7d75822064a71ae2f4e8626d6407f70fb4ef",
          12
        ],
        "amount": "144298.869318004879705706",
        "amountvalue": "144298869318004879705706",
        "tokenName": "Galaxy Finance Coin",
        "tokenSymbol": "GFC",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x0bf85d3b0c9ebcc282fde0591882d12e57e700b3",
          12
        ],
        "amount": "228.238334471554432006",
        "amountvalue": "228238334471554432006",
        "tokenName": "Filecoin",
        "tokenSymbol": "FIL",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x56b0c9b12e8480b4c865322cb3d5cef1c22c1430",
          12
        ],
        "amount": "891257592.699776810918234372",
        "amountvalue": "891257592699776810918234372",
        "tokenName": "Shiba Inu",
        "tokenSymbol": "SHIB",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xaad9654a4df6973a92c1fd3e95281f0b37960ccd",
          12
        ],
        "amount": "9.4010",
        "amountvalue": "940100000",
        "tokenName": "Bitcoin",
        "tokenSymbol": "BTC",
        "tokenDecimal": "8",
        "month": 12
      },
      {
        "_id": [
          "0xd16babe52980554520f6da505df4d1b124c815a7",
          12
        ],
        "amount": "28373895.262324",
        "amountvalue": "28373895262324",
        "tokenName": "Tether",
        "tokenSymbol": "USDT",
        "tokenDecimal": "6",
        "month": 12
      },
      {
        "_id": [
          "0xfe2f1890d8dc69cf16d611c71fef4a811ca84575",
          12
        ],
        "amount": "2531.5714",
        "amountvalue": "2531571400000000000000",
        "tokenName": "SAP Token",
        "tokenSymbol": "SAP",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x2da53728c13b56082c6b5dee966bcbad7e9934a1",
          12
        ],
        "amount": "13266.169879862295448000",
        "amountvalue": "13266169879862295448000",
        "tokenName": "GALA",
        "tokenSymbol": "GALA",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x07bcc2444cf4a3c750a534026dcd3bbc979efd85",
          12
        ],
        "amount": "956.106611933939850606",
        "amountvalue": "956106611933939850606",
        "tokenName": "Sandbox",
        "tokenSymbol": "SAND",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x9add100b10442269bfb650488c5e48ae3cbcf1d2",
          12
        ],
        "amount": "26383634400888.565530157930070078",
        "amountvalue": "26383634400888565530157930070078",
        "tokenName": "hoomoon",
        "tokenSymbol": "hoomoon",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xa1588dc914e236bb5ae4208ce3081246f7a00193",
          12
        ],
        "amount": "10.451446370701754002",
        "amountvalue": "10451446370701754002",
        "tokenName": "Ethereum",
        "tokenSymbol": "ETH",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x84a5a5d570b050f2509cca299841aa61187ab3de",
          12
        ],
        "amount": "3229.733775225199754566",
        "amountvalue": "3229733775225199754566",
        "tokenName": "Mobox",
        "tokenSymbol": "MBOX",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x263e10be808bafad9bd62a0998a36d4e6b9fcb19",
          12
        ],
        "amount": "153567.698",
        "amountvalue": "1535676980",
        "tokenName": "TokenPocket Token",
        "tokenSymbol": "TPT",
        "tokenDecimal": "4",
        "month": 12
      },
      {
        "_id": [
          "0x320ddb6a8d27170611d152da398f1c26d6581003",
          12
        ],
        "amount": "2.246699938837612584",
        "amountvalue": "2246699938837612584",
        "tokenName": "Olympus",
        "tokenSymbol": "OHM",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x13e93721dc992b3e14333dbdb48c0e7ec55431c3",
          12
        ],
        "amount": "265.00942",
        "amountvalue": "26500942000",
        "tokenName": "Litecoin",
        "tokenSymbol": "LTC",
        "tokenDecimal": "8",
        "month": 12
      },
      {
        "_id": [
          "0x8975e3e7cae30dacd7821256397456bbf773026f",
          12
        ],
        "amount": "4399.544737900789772842",
        "amountvalue": "4399544737900789772842",
        "tokenName": "Giftedhands Future",
        "tokenSymbol": "GHD",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x886db4c7827e196ecc777eeb6a94c23c79b9467a",
          12
        ],
        "amount": "754253.98138662",
        "amountvalue": "75425398138662",
        "tokenName": "Dogecoin",
        "tokenSymbol": "DOGE",
        "tokenDecimal": "8",
        "month": 12
      },
      {
        "_id": [
          "0xa787254704339474a827bd1ee4772c455e3ae7f2",
          12
        ],
        "amount": "18.343243298221310298",
        "amountvalue": "18343243298221310298",
        "tokenName": "Binance Coin",
        "tokenSymbol": "BNB",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xe7135426f31aa53b7a08d157f0138e03f48954d5",
          12
        ],
        "amount": "4637289480.144663078037688570",
        "amountvalue": "4637289480144663078037688570",
        "tokenName": "IRON Titanium Token",
        "tokenSymbol": "TITAN",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x1fc14e78612edc54e36506c4a11a1a3be4fe48af",
          12
        ],
        "amount": "226.896733417618795684",
        "amountvalue": "226896733417618795684",
        "tokenName": "Uniswap",
        "tokenSymbol": "UNI",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xbe8d16084841875a1f398e6c3ec00bbfcbfa571b",
          12
        ],
        "amount": "3148271.136435846408711798",
        "amountvalue": "3148271136435846408711798",
        "tokenName": "Pudding Token",
        "tokenSymbol": "PUD",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xc3c2b3a2bd04c0a36224eba45bce0d0719e6eaba",
          12
        ],
        "amount": "434188.577791893931794056",
        "amountvalue": "434188577791893931794056",
        "tokenName": "Spell Token",
        "tokenSymbol": "SPELL",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xb9445a228bcbc37344f19905d03e6f6a00f7e005",
          12
        ],
        "amount": "100000070112.5940",
        "amountvalue": "100000070112594000000000000000",
        "tokenName": "MolecularFuture",
        "tokenSymbol": "MOF",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0xd63f3cceef518e183e27615a7d6404d0803210af",
          12
        ],
        "amount": "5591995.535502056916985594",
        "amountvalue": "5591995535502056916985594",
        "tokenName": "Lendoo",
        "tokenSymbol": "LDT",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x294cde734a863dcf65417992424405bccf3973e7",
          12
        ],
        "amount": "8579.202671764857114440",
        "amountvalue": "8579202671764857114440",
        "tokenName": "Chainlink",
        "tokenSymbol": "LINK",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x7e49b17552c2e41555c3c8cbf3be742796019442",
          12
        ],
        "amount": "873.971125982706511768",
        "amountvalue": "873971125982706511768",
        "tokenName": "Molecular Future",
        "tokenSymbol": "MOF",
        "tokenDecimal": "18",
        "month": 12
      },
      {
        "_id": [
          "0x2d83f0551a65466aa4872cf25693f4c3e834f602",
          12
        ],
        "amount": "1264.4628",
        "amountvalue": "12644628",
        "tokenName": "EOS",
        "tokenSymbol": "EOS",
        "tokenDecimal": "4",
        "month": 12
      },
      {
        "_id": [
          "0x92a0bd4584c147d1b0e8f9185db0bda10b05ed7e",
          12
        ],
        "amount": "11075863.625610",
        "amountvalue": "11075863625610",
        "tokenName": "USDCoin",
        "tokenSymbol": "USDC",
        "tokenDecimal": "6",
        "month": 12
      }
    ],
    "totalAmount": [],
    "monthsAmount": [
      {
        "_id": 12,
        "amount": 65169.21252422202
      }
    ]
  }
}
```



##  添加项目信息

### api/addcontractinfo
#### method: Post
#### 请求参数：
无

#### 返回：

```javascript
{
  "code": 10000,
  "message": "success",
}
```

#### 示例

#####  请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"addcontractinfo","params":{"name":"uniswap","addresses":["0xc19D04E8Fe2d28609866e80356c027924F23B1A5"]}}' \
     https://graphapi.hoosmartchain.com/myapi/api/assetreport/

```

#####  应答
```
{
  "code": 10000,
  "message": "success",
}
```


##  添加代币价格数据源

### api/addtokenpricesource
#### method: Post
#### 请求参数：
无

#### 返回：

```javascript
{
  "code": 10000,
  "message": "success",
}
```

#### 示例

#####  请求
```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"addTokenPriceSource","params":{"address":"0xc19D04E8Fe2d28609866e80356c027924F23B1A5","source":"https://api.hoolgd.com/open/v1/tickers/all-market"}}' \
     https://graphapi.hoosmartchain.com/myapi/api/addtokenpricesource/

```

##### 应答
```
{
  "code": 10000,
  "message": "success",
}
```

