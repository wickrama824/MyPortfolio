const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// =====================================
// ADMIN LOGIN
// =====================================

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
            console.error("LOGIN DATABASE ERROR:", err.message);

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

            // Generate random session token
            const token = crypto.randomBytes(32).toString("hex");

            // Hash token before storing in database
            const tokenHash = crypto
                .createHash("sha256")
                .update(token)
                .digest("hex");

            // Session expires after 24 hours
            const expiresAt = new Date(
                Date.now() + 24 * 60 * 60 * 1000
            );

            const insertSql = `
                INSERT INTO sessions
                (admin_id, token_hash, expires_at)
                VALUES (?, ?, ?)
            `;

            db.query(
                insertSql,
                [admin.id, tokenHash, expiresAt],
                (insertErr) => {

                    if (insertErr) {
                        console.error(
                            "SESSION CREATE ERROR:",
                            insertErr.message
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Could not create login session"
                        });
                    }

                    console.log("ADMIN LOGIN SUCCESS");

                    return res.json({
                        success: true,
                        message: "Login successful",
                        token,
                        admin: {
                            id: admin.id,
                            username: admin.username
                        }
                    });
                }
            );

        } catch (error) {

            console.error("LOGIN ERROR:", error.message);

            return res.status(500).json({
                success: false,
                message: "Login failed"
            });
        }
    });
});


// =====================================
// ADMIN LOGOUT
// =====================================

router.post("/logout", authMiddleware, (req, res) => {

    const token = req.headers.authorization.split(" ")[1];

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    db.query(
        "DELETE FROM sessions WHERE token_hash = ?",
        [tokenHash],
        (err) => {

            if (err) {
                console.error("LOGOUT ERROR:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Logout failed"
                });
            }

            return res.json({
                success: true,
                message: "Logout successful"
            });
        }
    );
});


// =====================================
// CHANGE ADMIN PASSWORD
// =====================================

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

    db.query(
        "SELECT * FROM admin WHERE id = ?",
        [req.admin.id],
        async (err, result) => {

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

                db.query(
                    "UPDATE admin SET password = ? WHERE id = ?",
                    [hashedPassword, req.admin.id],
                    (updateErr) => {

                        if (updateErr) {
                            return res.status(500).json({
                                success: false,
                                message: "Failed to change password"
                            });
                        }

                        // Invalidate all existing sessions
                        db.query(
                            "DELETE FROM sessions WHERE admin_id = ?",
                            [req.admin.id],
                            (sessionErr) => {

                                if (sessionErr) {
                                    console.error(
                                        "SESSION DELETE ERROR:",
                                        sessionErr.message
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message: "Password changed, but session cleanup failed. Please contact support."
                                    });
                                }

                                return res.json({
                                    success: true,
                                    message: "Password changed. Please login again."
                                });
                            }
                        );
                    }
                );

            } catch (error) {

                console.error("PASSWORD ERROR:", error.message);

                return res.status(500).json({
                    success: false,
                    message: "Password change failed"
                });
            }
        }
    );
});

module.exports = router;