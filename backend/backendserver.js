const express = require('express')
const path = require('path')
const history = require('connect-history-api-fallback')

const app = express()

app.use(history({
    // OPTIONAL: Includes more verbose logging
    verbose: true
}))


// define a simple route
app.get('/claim', (req, res) => {


    res.json({"message": "."});
});


const port = process.env.PORT || 6788
app.listen(port)
console.log('Listening on port: ' + port)


