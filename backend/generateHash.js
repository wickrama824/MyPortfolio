const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter your new admin password: ", async (password) => {
    if (password.length < 8) {
        console.log("Password must contain at least 8 characters.");
        rl.close();
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("\nYour password hash:\n");
    console.log(hashedPassword);

    rl.close();
});