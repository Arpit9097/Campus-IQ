const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');
const User = require('../models/User');

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

        if (!profile) {
            // If no profile exists, return basic info from User
            const user = await User.findById(req.user.id).select('-password');
            return res.json({
                user,
                skills: [],
                projects: [],
                education: []
            });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
    const {
        tagline, profilePhoto, bio, phonenumber, location,
        cgpa, college, branch, batch,
        skills, education, projects, certifications, social
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (tagline) profileFields.tagline = tagline;
    if (profilePhoto) profileFields.profilePhoto = profilePhoto;
    if (bio) profileFields.bio = bio;
    if (phonenumber) profileFields.phonenumber = phonenumber;
    if (location) profileFields.location = location;

    // Academic Details
    if (cgpa) profileFields.cgpa = cgpa;
    if (college) profileFields.college = college;
    if (branch) profileFields.branch = branch;
    if (batch) profileFields.batch = batch;

    if (skills) profileFields.skills = skills;
    if (education) profileFields.education = education;
    if (projects) profileFields.projects = projects;
    if (certifications) profileFields.certifications = certifications;
    if (social) profileFields.social = social;

    try {
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            // Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );
            return res.json(profile);
        }

        // Create
        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
