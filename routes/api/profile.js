const express = require('express');
const passport = require('passport');

// load user model
const User = require('../../models/User');
// load profile model
const Profile = require('../../models/Profile');
const common = require('../../common/func');
const validateProfileInput = require('../../validation/profile');

const router = express.Router();

// @route   GET /api/profile/test
// @desc    Test profile route
// @access  Public
router.get('/test', (req, res) => res.send('Profile works'));

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/',
    passport.authenticate('jwt', {
        session: false
    }), common.catchErrors(async (req, res) => {
        errors = {};
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('users', ['name', 'avatar']);
        if (profile) {
            errors.profile = 'There is not profile for this user'
            res.status(404).send(errors)
        }
        res.send(profile);
    }))

// @route   POST /api/profile
// @desc    Create user profile
// @access  Private
router.post('/',
    passport.authenticate('jwt', {
        session: false
    }), common.catchErrors(async (req, res) => {

        // Input validation
        const {
            errors,
            isValid,
        } = validateProfileInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }

        // get fields
        const profileFields = {}
        profileFields.user = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;
        // Skills - Spilt into array
        if (typeof req.body.skills !== 'undefined') {
            profileFields.skills = req.body.skills.split(',');
        }
        // Social fields
        profileFields.social = {};
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

        // check if profile exists
        const profileExists = await Profile.findOne({
            user: req.user.id
        })

        // this is update profile request
        if (profileExists) {
            const profile = await Profile.findOneAndUpdate({
                user: req.user.id
            }, {
                $set: profileFields
            }, {
                new: true
            })
            return res.json(profile);
        }

        // this is create profile request
        let profile = await Profile.findOne({
            handle: profileFields.handle
        })
        if (profile) {
            errors.handle = 'That handle is already taken';
            res.status(400).json(error);
        }
        profile = new Profile(profileFields).save()
        res.json(profile);

    }))

module.exports = router;