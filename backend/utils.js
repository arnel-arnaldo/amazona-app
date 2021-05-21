import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign({               // JSON web token (JWT) has 3 parameters
        _id: user._id,              // object to authenticate
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET || 'somethingsecret', // JWT_SECRET, like a key that encrypts data
    {
        expiresIn: '30d',           // and num of days token will expire
    });   
};

export const isAuth = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization) {
        const token = authorization.slice(7, authorization.length);
        jwt.verify(
            token,
            process.env.JWT_SECRET || 'somethingsecret',
            (err, decode) => {
                if (err) {
                    res.status(401).send({ message: 'Invalid Token'});
                } else {
                    req.user = decode;
                    next();
                }
            }
        );
    } else {
        res.status(401).send({ message: 'No Token' });
    }
};

export const isAdmin = (req, res, next) => {
    if(req.user && req.user.isAdmin){
        next();
    } else {
        res.status(401).send({ message: 'Invalid Admin Token' });
    }
};