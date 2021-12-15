# MyAPIBox

```

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"gasfeereport","params":{"address":"0xc19d04e8fe2d28609866e80356c027924f23b1a5"}}' \
     https://graphapi.hoosmartchain.com/myapi/api/gasfeereport/



curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"gasfeereport","params":{"address":"0xc19d04e8fe2d28609866e80356c027924f23b1a5"}}' \
     http://localhost:8778/api/gasfeereport


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"interactivereport","params":{"address":"0xc19D04E8Fe2d28609866e80356c027924F23B1A5","year":"2021","range":"6"}}' \
     http://localhost:8778/api/interactivereport


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"assetreport","params":{"address":"0xc19D04E8Fe2d28609866e80356c027924F23B1A5","year":"2021"}}' \
     http://localhost:8778/api/assetreport


curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"addcontractinfo","params":{"name":"uniswap","addresses":["0xc19D04E8Fe2d28609866e80356c027924F23B1A5"]}}' \
     http://localhost:8778/api/addcontractinfo

curl -X POST \
     -H 'Content-Type: application/json' \
     -d '{"jsonrpc":"2.0","id":"id","method":"addTokenPriceSource","params":{"address":"0xc19D04E8Fe2d28609866e80356c027924F23B1A5","source":"https://api.hoolgd.com/open/v1/tickers/all-market"}}' \
     http://localhost:8778/api/addTokenPriceSource