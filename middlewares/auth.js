
const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if(!token){
        return res.status(401).json({
            status: false,
            message: 'No token, authorization denied',
            data: null
        });
    }

    try{
        // Verify token
        const decoded = jwt.verify(token, config.get('jwtsecret'));
        //Add user from payload
        req.user = decoded;
        next();
    } catch(e){
        res.status(400).json({
            status: false,
            message:'Token is not valid',
            data: null
        });
    }
}

module.exports = auth;
