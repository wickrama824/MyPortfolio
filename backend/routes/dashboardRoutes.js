const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// Get Dashboard Statistics
router.get("/", authMiddleware, (req, res) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM projects) AS totalProjects,
            (SELECT COUNT(*) FROM skills) AS totalSkills,
            (SELECT COUNT(*) FROM messages) AS totalMessages
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Dashboard Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to load dashboard statistics"
            });
        }

        res.json({
            success: true,
            statistics: result[0]
        });

    });

});

module.exports = router;