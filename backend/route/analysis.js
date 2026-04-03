const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

// Middleware to verify token (Duplicate from profile.js, ideally should be shared)
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

// @route   GET /api/analysis
// @desc    Get dashboard analysis based on profile
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.json({
                readinessScore: 0,
                eligibleCompanies: [],
                skillGaps: ["Add skills to see analysis"]
            });
        }

        // --- MOCK ANALYSIS LOGIC ---

        // 1. Readiness Score Calculation
        let baseScore = 20;
        let skillScore = Math.min(profile.skills.length * 5, 40); // Max 40 from skills
        let projectScore = Math.min(profile.projects.length * 15, 30); // Max 30 from projects
        let eduScore = Math.min(profile.education.length * 10, 10); // Max 10 from education (degree count)

        let totalScore = baseScore + skillScore + projectScore + eduScore;
        if (profile.cgpa && parseFloat(profile.cgpa) > 8.0) totalScore += 10; // Bonus

        // Cap score at 100
        if (totalScore > 100) totalScore = 100;

        // Breakdown for Charts
        const scoreBreakdown = [
            { name: "Base", value: baseScore },
            { name: "Skills", value: skillScore },
            { name: "Projects", value: projectScore },
            { name: "Education", value: eduScore }
        ];

        // 2. Skill Gaps (Simple diff against a "Market Demand" list)
        const marketSkills = ["React.js", "Node.js", "Python", "Data Structures", "System Design", "AWS", "SQL"];
        const userSkillsLower = profile.skills.map(s => s.toLowerCase());
        const skillGaps = marketSkills.filter(s => !userSkillsLower.includes(s.toLowerCase()));

        // 3. Eligible Companies (Mock Simulation)
        const mockCompanies = [
            { name: "Google", reqSkills: ["Data Structures", "Algorithms", "C++"] },
            { name: "Microsoft", reqSkills: ["C#", "System Design", "Azure"] },
            { name: "Amazon", reqSkills: ["Java", "AWS", "Problem Solving"] },
            { name: "Netflix", reqSkills: ["Python", "React", "Microservices"] },
            { name: "TCS", reqSkills: ["Java", "SQL"] },
            { name: "Infosys", reqSkills: ["Python", "Communication"] }
        ];

        let eligibleCompanies = mockCompanies.map(company => {
            // Calculate a simple match score
            const matchCount = company.reqSkills.filter(req =>
                userSkillsLower.includes(req.toLowerCase()) ||
                userSkillsLower.some(us => us.includes(req.toLowerCase()))
            ).length;

            // Random factor + match factor
            let companyScore = 40 + (matchCount * 20);
            if (companyScore > 98) companyScore = 98;

            return { name: company.name, score: companyScore };
        });

        // Sort by highest match
        eligibleCompanies.sort((a, b) => b.score - a.score);


        res.json({
            readinessScore: Math.round(totalScore),
            scoreBreakdown,
            eligibleCompanies: eligibleCompanies.slice(0, 5), // Top 5
            skillGaps: skillGaps.slice(0, 5) // Top 5 gaps
        });

    } catch (err) {
        console.error("Analysis Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
