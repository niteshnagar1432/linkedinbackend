const jwt = require('jsonwebtoken');
const secretKey = 'kuiyfhgcvs9876tyfgvb';

module.exports = (req, res, next) => {
    const bearerToken = req.headers['authorization'];

    if (typeof bearerToken !== 'undefined') {
        const token = bearerToken.split(' ')[1];
        jwt.verify(token, secretKey, (err, authData) => {
            if (err) {
                res.json({ status: 403, success: false, msg: 'Invalid Token' });
            } else {
                req.authData = authData;
                next();
            }
        });
    } else {
        res.json({ status: 401, success: false, msg: 'Unauthorized' });
    }
}
