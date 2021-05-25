# NFTBox

```
curl https://box.hoosmartchain.com/api/banners

```


```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"myboxes","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:6789/api/myboxes

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"myboxes","params":{"address":"0x187E9C0A52742604690eD1647E130e7616146b08"}}' \
     http://localhost:6789/api/myboxes
```

```

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e","times":2}}' \
     http://localhost:6789/api/claimbox

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:6789/api/claimbox

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x187E9C0A52742604690eD1647E130e7616146b08"}}' \
     http://localhost:6789/api/claimbox

```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"openbox","params":{"address":"0xC6019a869Fd3B421A5b0BFD4a83b86799E3cBAAF"}}' \
     http://localhost:6789/api/openbox


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"openbox","params":{"address":["0x4b2C93469063e23786dF13Baa42CAfB8F67005de","0x387c71E8003092199dB65c6c3cbB2C36a9163E9A"]}}' \
     http://localhost:6789/api/openbox


```



Cole：代币名称：LDT
合约地址：0xd63F3cceef518e183e27615A7D6404d0803210Af
精度：18
代币名称：PUD
合约地址：0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b
精度：18
代币名称：HSB
合约地址：0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d
精度：18
代币名称：LOOT
合约地址：0xD8f6d61C2cC69c04F176616aD1c7de211b00af31
精度：18
代币名称：GFC
合约地址：0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF
精度：18
代币名称：iXT（测试币）
合约地址：0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC
精度：18
代币名称:SAP
合约地址：0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575
精度：18
代币名称： YUNGE
合约地址：0x07f823D3d011f7C612084f04D025F4a026F76afd
精度：18
代币名称：Roolend（在完善测试币合约地址）


        const names = ["PuddingSwap", "Lendoo", "HeshiSwap", "GFC", "LOOT", "Yunge", "SwapXT", "Roolend", "SwapAll"];

   const MAINNET_CONTRACT_ADDRESS = ["0x989418e99E3B29A81906fb9998AEfa74EAae2539", "0xF89FfE451d065E488188ca0e4dFd0318DDe034c8",
           "0xbE8D16084841875a1f398E6C3eC00bBfcbFa571b", "0xd63F3cceef518e183e27615A7D6404d0803210Af",
"0xd9e2c2b61204837c833a9A301c5DA7b500cB3e6d",
"0xE9FB7d75822064A71aE2F4E8626D6407F70Fb4eF","0xD8f6d61C2cC69c04F176616aD1c7de211b00af31","0x07f823D3d011f7C612084f04D025F4a026F76afd","0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","",
"0xFE2F1890d8DC69cf16D611C71fEf4A811ca84575"
        ];