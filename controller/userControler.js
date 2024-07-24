const users=require("../models/userModel")
const jwt = require('jsonwebtoken');
exports.signUp = async (req, res) => {
    const { userName, email, password } = req.body;
    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json("User already exisits.");
        } else {
            const newUser = new users({
                userName, email, password
            });
            await newUser.save();
            return res.status(200).json(newUser );
        }
    } catch (err) {
        return res.status(500).json(`Create API failed: ${err}`);
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existUser = await users.findOne({ email, password });

        if (existUser) {
            const token = jwt.sign({ _id: existUser._id }, "supersecretkey123");
            // console.log(token);

            return res.status(200).json({
                user: existUser,
                token
            });

        } else {
            return res.status(404).json("Incorrect email and password");
        }
    } catch (err) {
        return res.status(500).json(`Login API failed: ${err}`);
    }
};
