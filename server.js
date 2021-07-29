const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:7789");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
// app.use(history({
//     // OPTIONAL: Includes more verbose logging
//     verbose: true
// }))
// app.use(express.bodyParser());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(express.json())

// define a simple route
// app.get('/', (req, res) => {
//     res.json({"message": "."});
// });

require('./app/routes/nft.routes.js')(app);


const port = process.env.PORT || 6789
app.listen(port)
console.log('Listening on port: ' + port)


