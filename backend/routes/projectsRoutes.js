const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET PROJECTS
router.get("/", (req, res) => {
    db.query("SELECT * FROM projects ORDER BY id DESC", (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error fetching projects"
            });
        }

        res.json(result);
    });
});

// ADD PROJECT
router.post("/", authMiddleware, (req, res) => {
    const {
        title,
        description,
        technologies,
        image,
        project_link
    } = req.body;

    if (!title) {
        return res.status(400).json({
            message: "Project title is required"
        });
    }

    const sql = `
        INSERT INTO projects
        (title, description, technologies, image, project_link)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        title,
        description,
        technologies,
        image,
        project_link
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error adding project"
            });
        }

        res.status(201).json({
            message: "Project added successfully",
            id: result.insertId
        });
    });
});

// UPDATE PROJECT
router.put("/:id", authMiddleware, (req, res) => {
    const {
        title,
        description,
        technologies,
        image,
        project_link
    } = req.body;

    const sql = `
        UPDATE projects SET
        title = ?,
        description = ?,
        technologies = ?,
        image = ?,
        project_link = ?
        WHERE id = ?
    `;

    db.query(sql, [
        title,
        description,
        technologies,
        image,
        project_link,
        req.params.id
    ], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error updating project"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project updated successfully"
        });
    });
});

// DELETE PROJECT
router.delete("/:id", authMiddleware, (req, res) => {
    db.query("DELETE FROM projects WHERE id = ?", [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                message: "Error deleting project"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.json({
            message: "Project deleted successfully"
        });
    });
});

module.exports = router;