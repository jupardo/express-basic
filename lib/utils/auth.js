const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;
const roles = require('../../config/roles.json');

function createToken(data){
    return jwt.sign({ 
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data,
    }, secret);
}

function checkToken(req, res, next){
    // TODO Validate token
    const {baseUrl, _parsedUrl, method, headers} = req;
    const {path} = _parsedUrl;
    const matched = `${baseUrl}${path}`;  
    try {
        if(!roles[matched] || !roles[matched][method]) {
            // If route or method not in json, we assume that's a public api
            //res.status(405);
            //res.send('Method not allowed, pls check roles.json');
            next();
            return;
        }
        const token = jwt.verify(headers.token, secret);
        const decoded = JSON.parse(token.data);
        const allowedRoles = roles[matched][method];
        if(!allowedRoles.some((role) => role === decoded.role)) {
            res.status(403);
            res.send('Forbidden, check your permissions dude');
            return;
        }
        next();
        return;
    } catch(error) {
        res.status(401);
        res.send('Token could not be verified')
        return;
    }
}



module.exports = {
    checkToken: checkToken,
    createToken: createToken
  }
