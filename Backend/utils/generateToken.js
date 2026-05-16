const jwt = require('jsonwebtoken');

const generateToken = (role) => {
    return jwt.sign({role}, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
};

module.exports = generateToken;