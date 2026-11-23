const express = require("express");
const router = express.Router();

const db = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

// GET ALL EDUCATION DETAILS
router.get("/", (req, res) => {
    const sql = "SELECT * FROM education ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Education Fetch Error:", err.message);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch education details"
            });
        }

        res.json(result);
    });
});

// ADD EDUCATION
router.post("/", authMiddleware, (req, res) => {
    const {
        institution,
        qualification,
        description,
        start_year,
        end_year
    } = req.body;

    if (!institution || !qualification) {
        return res.status(400).json({
            success: false,
            message: "Institution and qualification are required"
        });
    }

    const sql = `
        INSERT INTO education
        (institution, qualification, description, start_year, end_year)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            institution,
            qualification,
            description || "",
            start_year || "",
            end_year || ""
        ],
        (err, result) => {
            if (err) {
                console.error("Education Add Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to add education"
                });
            }

            res.status(201).json({
                success: true,
                message: "Education added successfully",
                id: result.insertId
            });
        }
    );
});

// UPDATE EDUCATION
router.put("/:id", authMiddleware, (req, res) => {
    const {
        institution,
        qualification,
        description,
        start_year,
        end_year
    } = req.body;

    const sql = `
        UPDATE education
        SET institution = ?,
            qualification = ?,
            description = ?,
            start_year = ?,
            end_year = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            institution,
            qualification,
            description || "",
            start_year || "",
            end_year || "",
            req.params.id
        ],
        (err, result) => {
            if (err) {
                console.error("Education Update Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to update education"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Education not found"
                });
            }

            res.json({
                success: true,
                message: "Education updated successfully"
            });
        }
    );
});

// DELETE EDUCATION
router.delete("/:id", authMiddleware, (req, res) => {
    db.query(
        "DELETE FROM education WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                console.error("Education Delete Error:", err.message);

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete education"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Education not found"
                });
            }

            res.json({
                success: true,
                message: "Education deleted successfully"
            });
        }
    );
});

module.exports = router;