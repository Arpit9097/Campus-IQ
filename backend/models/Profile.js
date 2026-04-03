const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    tagline: { type: String, default: 'Student at CampusIQ' },
    profilePhoto: { type: String }, // Base64 string or URL
    bio: { type: String },
    phonenumber: { type: String },
    location: { type: String },

    // Academic Details
    cgpa: { type: String },
    college: { type: String },
    branch: { type: String },
    batch: { type: String },

    skills: [String],

    education: [{
        school: { type: String, required: true },
        degree: { type: String },
        fieldOfStudy: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        grade: { type: String },
        description: { type: String }
    }],

    projects: [{
        name: { type: String, required: true },
        description: { type: String },
        technologies: [String],
        link: { type: String }
    }],

    certifications: [String], // Keeping simple array for now as per old profile, or could objectify

    social: {
        linkedin: { type: String },
        github: { type: String },
        twitter: { type: String },
        website: { type: String }
    },

    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Profile', profileSchema);
