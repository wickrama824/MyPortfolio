const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET PROFILE
router.get("/", (req, res) => {

    const sql = "SELECT * FROM profile LIMIT 1";

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Profile Fetch Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to load profile"
            });
        }

        res.json({
            success: true,
            profile: result.length > 0 ? result[0] : null
        });

    });

});


// CREATE PROFILE
router.post("/", authMiddleware, (req, res) => {

    const {
        name,
        title,
        description,
        email,
        location,
        profile_image,
        linkedin,
        github
    } = req.body;

    const sql = `
        INSERT INTO profile
        (name, title, description, email, location, profile_image, linkedin, github)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            name,
            title,
            description,
            email,
            location,
            profile_image,
            linkedin,
            github
        ],
        (err, result) => {

            if (err) {
                console.error("Profile Save Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to save profile"
                });
            }

            res.status(201).json({
                success: true,
                message: "Profile created successfully",
                id: result.insertId
            });

        }
    );

});


// UPDATE PROFILE
router.put("/:id", authMiddleware, (req, res) => {

    const { id } = req.params;

    const {
        name,
        title,
        description,
        email,
        location,
        profile_image,
        linkedin,
        github
    } = req.body;

    const sql = `
        UPDATE profile
        SET
            name = ?,
            title = ?,
            description = ?,
            email = ?,
            location = ?,
            profile_image = ?,
            linkedin = ?,
            github = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            name,
            title,
            description,
            email,
            location,
            profile_image,
            linkedin,
            github,
            id
        ],
        (err, result) => {

            if (err) {
                console.error("Profile Update Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update profile"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Profile not found"
                });
            }

            res.json({
                success: true,
                message: "Profile updated successfully"
            });

        }
    );

});

module.exports = router;