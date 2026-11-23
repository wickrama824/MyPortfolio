const crypto = require("crypto");
const db = require("../config/db");

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please login."
        });
    }

    const token = authHeader.split(" ")[1];

    const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const sql = `
        SELECT a.id, a.username
        FROM sessions s
        JOIN admin a ON s.admin_id = a.id
        WHERE s.token_hash = ?
        AND s.expires_at > NOW()
    `;

    db.query(sql, [tokenHash], (err, result) => {

        if (err) {
            console.error("SESSION CHECK ERROR:", err.message);

            return res.status(500).json({
                success: false,
                message: "Authentication error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
        }

        req.admin = {
            id: result[0].id,
            username: result[0].username
        };

        next();
    });
};

module.exports = authMiddleware;