const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 4000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    ssl: {
        minVersion: "TLSv1.2"
    }
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("TiDB Connection Failed:", err.message);
        return;
    }

    console.log("TiDB Connected Successfully!");

    connection.release();
});

module.exports = db;