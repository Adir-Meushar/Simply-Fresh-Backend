const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({
            error: {
                code: 401,
                message: 'Unauthorized',
                details: 'Token is missing.',
            },
        });
    }

    try {

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        next();
        
    }catch (error) {
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({
                error: {
                    code: 401,
                    message: 'Unauthorized',
                    details: 'Token has expired.',
                },
            });
        } else {
            return res.status(401).send({
                error: {
                    code: 401,
                    message: 'Unauthorized',
                    details: 'An error occurred while verifying the token.',
                },
            });
        }
    }
};