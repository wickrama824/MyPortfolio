const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET - Get all messages (Admin only)
router.get("/", authMiddleware, (req, res) => {

    const sql = `
        SELECT * FROM messages
        ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.error("Get Messages Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to load messages"
            });
        }

        res.json({
            success: true,
            messages: result
        });

    });
});


// POST - Send a new message (Public)
router.post("/", (req, res) => {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all required fields"
        });
    }

    const sql = `
        INSERT INTO messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, subject || "", message],
        (err, result) => {

            if (err) {
                console.error("Send Message Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to send message"
                });
            }

            res.status(201).json({
                success: true,
                message: "Message sent successfully!"
            });

        }
    );

});


// PATCH - Mark message as read (Admin only)
router.patch("/:id/read", authMiddleware, (req, res) => {

    const sql = `
        UPDATE messages
        SET is_read = TRUE
        WHERE id = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.error("Mark Read Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to update message"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.json({
            success: true,
            message: "Message marked as read"
        });

    });

});


// DELETE - Delete message (Admin only)
router.delete("/:id", authMiddleware, (req, res) => {

    const sql = "DELETE FROM messages WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {

        if (err) {
            console.error("Delete Message Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to delete message"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.json({
            success: true,
            message: "Message deleted successfully"
        });

    });

});

module.exports = router;