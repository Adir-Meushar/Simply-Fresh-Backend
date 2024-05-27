const jwt = require('jsonwebtoken');

exports.getUserInfo = (req, res) => {
    if (!req.headers.authorization) {
        return null;
    }

    try {
        const data = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);

        if (!data) {
            res.status(401).send('User is not authorized.');
        }
        
        return data;

    } catch (error) {
        res.status(401).send('Error decoding the token.');
        return null;
    }
};
