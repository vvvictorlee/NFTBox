const jwt = require('express-jwt');
const secret = process.env.SECRET||""

module.exports = authorize;

function authorize() {
    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret, algorithms: ['HS256'] }),

        // authorize based on user role
        (req, res, next) => {
            if (req.ip!=req.user.acc ||req.address!=req.user.pwd) {
                // user's role is not authorized
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // authentication and authorization successful
            next();
        }
    ];
}