const User = require('../models/user.model');
const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {

    try {
        let token = req.cookies.access_token;


        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Unauthorized user'
            })
        }

        decoded = await jwt.verify(token, 'some secret here');
        if (!decoded) {
            res.status(400).json({
                success: false,
                message: 'invalid token'
            })
        } else {

            let verifyuser = await User.findById(decoded.id)
            if (!verifyuser) {
                res.status(400).json({
                    success: false,
                    message: 'login first '
                })
            }
            req.user = verifyuser
            next()
        }




    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = auth