const express = require('express');
const passport = require('passport');

// load user model
const User = require('../../models/User');
// load profile model
const Profile = require('../../models/Profile');
const common = require('../../common/func');
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

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
        if (!profile) {
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
            res.status(400).json(errors);
        }
        profile = new Profile(profileFields).save()
        res.json(profile);

    }));

// @route   GET /api/profile/handle/:handle
// @desc    Get profile
// @access  Public
router.get('/handle/:handle',
    common.catchErrors(async (req, res) => {
        errors = {};
        const profile = await Profile.findOne({
            handle: req.params.handle
        }).populate('users', ['name', 'avatar']);
        if (!profile) {
            errors.profile = 'There is not profile for this handle'
            return res.status(404).send(errors)
        }
        res.send(profile);
    }));

// @route   GET /api/profile/user/:id
// @desc    Get profile
// @access  Public
router.get('/user/:id',
    async (req, res) => {
        errors = {};
        try {
            const profile = await Profile.findOne({
                user: req.params.id
            }).populate('users', ['name', 'avatar']);
            if (!profile) {
                errors.profile = 'There is no profile for this user'
                return res.status(404).send(errors)
            }
            res.send(profile);
        } catch (err) {
            errors.profile = 'There is no profile for this user'
            return res.status(404).send(errors)
        }
    });

// @route   GET /api/profile/all
// @desc    Get all profiles
// @access  Public
router.get('/all',
    common.catchErrors(async (req, res) => {
        errors = {};
        const profiles = await Profile.find().populate('users', ['name', 'avatar']);
        if (!profiles) {
            errors.profile = 'There are no profiles'
            return res.status(404).send(errors)
        }
        res.send(profiles);
    }));

// @route   POST /api/profile/experience
// @desc    Save user experience details
// @access  Private
router.post('/experience',
    passport.authenticate('jwt', {
        session: false
    }), common.catchErrors(async (req, res) => {
        // Input validation
        const {
            errors,
            isValid,
        } = validateExperienceInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        newExp = {
            title: req.body.title,
            company: req.body.company,
            description: req.body.description,
            from: req.body.from,
            to: req.body.to,
            location: req.body.location,
            current: req.body.current,
        }
        const profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            errors.profile = 'There is not profile for this user';
            res.status(404).json(errors);
        }
        // Add to exp array
        profile.experience.unshift(newExp);
        const result = await profile.save();
        res.json(result);
    }));

// @route   POST /api/profile/education
// @desc    Save user education details
// @access  Private
router.post('/education',
    passport.authenticate('jwt', {
        session: false
    }), common.catchErrors(async (req, res) => {
        // Input validation
        const {
            errors,
            isValid,
        } = validateEducationInput(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        newEdu = {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
        }
        const profile = await Profile.findOne({
            user: req.user.id
        });
        if (!profile) {
            errors.profile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        // Add to exp array
        profile.education.unshift(newEdu);
        const result = await profile.save();
        res.json(result);
    }));

module.exports = router;