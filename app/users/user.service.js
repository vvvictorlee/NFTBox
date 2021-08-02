const secret = process.env.SECRET||""
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate
};

async function authenticate({ ip, address }) {
        const token = jwt.sign({ acc: ip, pwd: address }, secret);
        return   token
       
}
