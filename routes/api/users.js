const express = require('express');
const gravatar = require('gravatar');
const brcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');


//Load User model
const User = require('../../models/User');
const secretOrKey = require('../../config/keys').secretOrKey;
const common = require('../../common/func');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const router = express.Router();

// @route   GET /api/users/test
// @desc    Test users route
// @access  Public
router.get('/test', (req, res) => res.json({
    "msg": "Users works11"
}));

// @route   POST /api/users/register
// @desc    Register user
// @access  Public
router.post('/register', common.catchErrors(async (req, res) => {
    const {
        errors,
        isValid,
    } = validateRegisterInput(req.body);

    // Input validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const {
        email,
        password,
        name,
    } = req.body;
    const user = await User.findOne({
        email
    });
    // email in use
    if (user) {
        return res.status(400).send({
            'email': 'Email already exists'
        })
    }
    // email is not in use, so register
    var avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: '404' // default
    });
    const newUser = new User({
        email,
        password,
        name,
        avatar,
    });
    brcrypt.genSalt(10, common.catchErrors(async (err, salt) => {
        const hash = await brcrypt.hash(newUser.password, salt);
        newUser.password = hash;
        const result = await newUser.save();
        res.json(result);
    }))

}));

// @route   POST /api/users/login
// @desc    Login with email, password and get JWT
// @access  Public
router.post('/login', common.catchErrors(async (req, res) => {
    const {
        errors,
        isValid,
    } = validateLoginInput(req.body);

    // Input validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    let {
        email,
        password
    } = req.body;
    // find user
    const user = await User.findOne({
        email
    });
    // user not found
    if (!user) {
        errors.email = 'User not found';
        return res.status(404).json(errors);
    }
    // check for password
    const isMatch = await brcrypt.compare(password, user.password);
    if (!isMatch) {
        errors.password = 'Incorrect password'
        return res.status(400).json(errors);
    }
    // password matched
    let payload = {
        id: user.id,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    };
    // get token
    const token = await jwt.sign(payload, secretOrKey, {
        expiresIn: 3600 * 24
    });
    return res.json({
        success: true,
        token: `Bearer ${token}`
    });
}));

// @route   GET /api/users/current
// @desc    Get current user
// @access  Private
router.get("/current", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        id,
        name,
        email,
        avatar
    } = req.user;
    return res.json({
        id,
        name,
        email,
        avatar
    });
});

module.exports = router;