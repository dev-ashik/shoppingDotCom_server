var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const { hashPassword, comparePassword } = require('../helpers/authHelper');

const registerController = async (req, res) => {
    try {
        const {name, email, password, phone, address } = req.body;
        // validation
        if(!name) {
            return res.send({message: "Name is Required"})
        }
        if(!email) {
            return res.send({message: "Email is Required"})
        }
        if(!password) {
            return res.send({message: "Password is Required"})
        }
        if(!phone) {
            return res.send({message: "Phone is Required"})
        }
        if(!address) {
            return res.send({message: "Address is Required"})
        }

        // esistiong user
        const existiongUser = await userModel.findOne({email});
        if(existiongUser) {
            return res.status(200).send({
                success: false,
                message: "Already Registered please login"
            })
        }

        // register user 
        const hashedPassword = await hashPassword(password);
        const user = await new userModel({name, email, phone, address, password:hashedPassword }).save()

        res.status(201).send({
            success: true,
            message: "User Registered Successfully",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
};


const loginController = async (req, res) => {
    try {
        const {email, password} = req.body;

        // validation
        if(!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password',
            })
        }

        // check user
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registerd"
            })
        }

        const match = await comparePassword(password, user.password);
        if(!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"
            })
        }

        // token
        const token = await jwt.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.status(200).send({
            success: true,
            message: "login successful",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token
        });

    } catch(error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error in login",
            error
        })
    }
}


const testController = (req, res) => {
    res.send("working..")
}

module.exports = {registerController, loginController, testController};
