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
     http://localhost:6788/api/claimbox
```

```
curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"openbox","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:6788/api/openbox
```