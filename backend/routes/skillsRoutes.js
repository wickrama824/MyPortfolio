const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL SKILLS
router.get("/", (req, res) => {
    db.query("SELECT * FROM skills ORDER BY id DESC", (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching skills"
            });
        }

        res.json(result);
    });
});

// ADD SKILL
router.post("/", authMiddleware, (req, res) => {
    const { name, category, image } = req.body;

    if (!name) {
        return res.status(400).json({
            message: "Skill name is required"
        });
    }

    const sql = `
        INSERT INTO skills (name, category, image)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [name, category, image || null], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error adding skill"
            });
        }

        res.status(201).json({
            message: "Skill added successfully",
            id: result.insertId
        });
    });
});

// UPDATE SKILL
router.put("/:id", authMiddleware, (req, res) => {
    const { name, category, image } = req.body;

    const sql = `
        UPDATE skills
        SET name = ?, category = ?, image = ?
        WHERE id = ?
    `;

    db.query(sql, [name, category, image || null, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error updating skill"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.json({
            message: "Skill updated successfully"
        });
    });
});

// DELETE SKILL
router.delete("/:id", authMiddleware, (req, res) => {
    db.query("DELETE FROM skills WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting skill"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Skill not found"
            });
        }

        res.json({
            message: "Skill deleted successfully"
        });
    });
});

module.exports = router;