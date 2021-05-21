# NFTBox

```
curl https://box.hoosmartchain.com/api/banners

```


```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"myboxes","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:6789/api/myboxes
```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbox","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:6789/api/claimbox
```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"openbox","params":{"address":"0xE1cdCB6C6B69e03d210B0Cfa49270F7f0D5EC243"}}' \
     http://localhost:6789/api/openbox
```