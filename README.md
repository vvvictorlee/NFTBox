# NFTBox

```

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x5ba2A8748981c3B2C150c2d7aF391B104E399ACb","ip":"1.2.3.4"}}' \
     http://localhost:8777/api/claimbadge


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e","ip":"1.2.3.4"}}' \
     http://localhost:8788/api/claimbadge


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     http://localhost:8789/api/claimbadge

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"mybadge","params":{"address":"0x5ba2A8748981c3B2C150c2d7aF391B104E399ACb"}}' \
     http://localhost:8788/api/mybadge

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"ismaxtotalsupply","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e","ip":"1.2.3.4"}}' \
     http://localhost:8788/api/ismaxtotalsupply


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
     https://testbadge.hoosmartchain.com/api/claimbadge


```===============
TOKEN=$(curl -s -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":"id","method":"ismaxtotalsupply","params":{"address":"0x302b342e5080841040FF35c5Fc5e7A44502C1085","ip":"1.2.3.4"}}' http://localhost:8788/api/ismaxtotalsupply | jq -r '.data.token')

curl -X POST \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${TOKEN}" \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x302b342e5080841040FF35c5Fc5e7A44502C1085","ip":"1.2.3.4"}}' \
     http://localhost:8788/api/claimbadge

===========
TOKEN=$(curl -s -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' --data '{"jsonrpc":"2.0","id":"id","method":"ismaxtotalsupply","params":{"address":"0x5ba2A8748981c3B2C150c2d7aF391B104E399ACb","ip":"1.2.3.4"}}' https://safe-client.hoosmartchain.com/api/ismaxtotalsupply | jq -r '.data.token')

curl -X POST \
     -H 'Content-Type: application/json' \
     -H "Authorization: Bearer ${TOKEN}" \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e","ip":"1.2.3.4"}}' \
     https://safe-client.hoosmartchain.com/api/claimbadge

=============

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"mybadge","params":{"address":"0x4a79c58CCf9d80353c02357F26D6f7b99fA9991e"}}' \
    https://testbadge.hoosmartchain.com/api/mybadge



curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"claimbadge","params":{"address":"0x5ba2A8748981c3B2C150c2d7aF391B104E399ACb"}}' \
      https://badge.hoosmartchain.com/api/claimbadge


curl  https://nft.hoosmartchain.com/api/ismaxtotalsupply
curl  http://localhost:7789/api/ismaxtotalsupply
curl -H "Origin: http://localhost:3000" --head http://localhost:7789/api/ismaxtotalsupply
```


