const readline = require("readline");
const bcrypt = require("bcrypt");
const db = require("./config/db");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function closeProgram() {
    rl.close();
    db.end();
}

rl.question("Enter Admin Username: ", (username) => {

    rl.question("Enter Admin Password: ", async (password) => {

        username = username.trim();

        if (!username || password.length < 8) {
            console.log(
                "Username is required and password must have at least 8 characters."
            );

            closeProgram();
            return;
        }

        try {
            // Check whether username already exists
            db.query(
                "SELECT id FROM admin WHERE username = ?",
                [username],
                async (err, result) => {

                    if (err) {
                        console.log("Database Error:", err.message);
                        closeProgram();
                        return;
                    }

                    if (result.length > 0) {
                        console.log("This username already exists!");
                        closeProgram();
                        return;
                    }

                    try {
                        // Hash password
                        const hashedPassword = await bcrypt.hash(
                            password,
                            10
                        );

                        // Insert admin account
                        const sql = `
                            INSERT INTO admin (username, password)
                            VALUES (?, ?)
                        `;

                        db.query(
                            sql,
                            [username, hashedPassword],
                            (insertError, insertResult) => {

                                if (insertError) {
                                    console.log(
                                        "Error creating admin:",
                                        insertError.message
                                    );
                                } else {
                                    console.log(
                                        "\nAdmin account created successfully!"
                                    );

                                    console.log(
                                        "Admin ID:",
                                        insertResult.insertId
                                    );

                                    console.log(
                                        "Admin Username:",
                                        username
                                    );
                                }

                                closeProgram();
                            }
                        );

                    } catch (error) {
                        console.log("Password Error:", error.message);
                        closeProgram();
                    }
                }
            );

        } catch (error) {
            console.log("Error:", error.message);
            closeProgram();
        }
    });
});