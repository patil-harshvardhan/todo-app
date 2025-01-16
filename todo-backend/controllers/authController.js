const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const Collection = require('../models/Collection');

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        // create a default collection for the user
        const collection = await Collection.create({ name: 'Default', user: user._id });

        res.status(201).json({message: 'User registered successfully'});
    }catch(err) {
        console.error(err);
        res.status(400).json({error: 'User already exists or invalid input'});
    }
}


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({error: 'Invalid email or password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.json({token});
    }
    catch(err) {
        res.status(500).json({error: 'Something went wrong'});
    }
}

exports.getUser = async (req, res) => {
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err) {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    }
}

