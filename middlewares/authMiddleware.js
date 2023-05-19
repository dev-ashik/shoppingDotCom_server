var jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// protected routes token base
const requireSingIn = async (req, res, next) => {
  try {
    // console.log(req.headers.authorization, process.env.JWT_SECRET)
     const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};


// admin access
const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if(user.admin !== true) {
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access"
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success: false,
            error,
            message: "Error in admin middelware"
        })
    }
}

module.exports = {requireSingIn, isAdmin};
