const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()

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


