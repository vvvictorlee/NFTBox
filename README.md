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


```