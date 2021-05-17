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