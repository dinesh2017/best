const asyncHandler = require("express-async-handler");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const APIError = require('../utils/APIError');

exports.validateToken = asyncHandler(async (req, res, next) => {
    
    try {
        let token = undefined;    
        let authHeader = req.headers.Authorization || req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    next(new APIError({ message: "User is not authorized", status: httpStatus.UNAUTHORIZED }));
                }
                req.user = decoded.token;
                next();
            })

        }
        if (!token) {
            next(new APIError({ message: "User is not authorized", status: httpStatus.UNAUTHORIZED }));
        }
    } catch (error) {
        next(new APIError(error));
    }

})

