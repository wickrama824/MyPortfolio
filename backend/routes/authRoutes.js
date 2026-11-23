const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// ADMIN LOGIN
router.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });
    }

    const sql = "SELECT * FROM admin WHERE username = ?";

    db.query(sql, [username], async (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        try {

            const admin = result[0];

            const isMatch = await bcrypt.compare(
                password,
                admin.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }

            const token = jwt.sign(
                {
                    id: admin.id,
                    username: admin.username
                },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                success: true,
                message: "Login successful",
                token,
                admin: {
                    id: admin.id,
                    username: admin.username
                }
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: "Login failed"
            });

        }

    });

});


// CHANGE ADMIN PASSWORD
router.put("/change-password", authMiddleware, async (req, res) => {

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "Please enter both passwords"
        });
    }

    if (newPassword.length < 8) {
        return res.status(400).json({
            success: false,
            message: "New password must contain at least 8 characters"
        });
    }

    try {

        const sql = "SELECT * FROM admin WHERE id = ?";

        db.query(sql, [req.admin.id], async (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Database error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Admin account not found"
                });
            }

            try {

                const admin = result[0];

                const isMatch = await bcrypt.compare(
                    currentPassword,
                    admin.password
                );

                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: "Current password is incorrect"
                    });
                }

                const hashedPassword = await bcrypt.hash(
                    newPassword,
                    10
                );

                const updateSql = `
                    UPDATE admin
                    SET password = ?
                    WHERE id = ?
                `;

                db.query(
                    updateSql,
                    [hashedPassword, req.admin.id],
                    (updateErr) => {

                        if (updateErr) {
                            return res.status(500).json({
                                success: false,
                                message: "Failed to change password"
                            });
                        }

                        res.json({
                            success: true,
                            message: "Password changed successfully"
                        });

                    }
                );

            } catch (error) {

                res.status(500).json({
                    success: false,
                    message: "Password change failed"
                });

            }

        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }

});

module.exports = router;