const pool = require("../config/database");

async function login(credentials) {
    const { name, password } = credentials;

    try {
        const query = "Insert INTO login (name,password) VALUES(?, ?)";
        const [result] = await pool.query(query, [name, password]);
        console.log("Data inserted sucessfully");
        return result;

    }
    catch (e) {
        console.error("Erroe inserting data into login table", e);
        throw e;

    }
}

exports.module = {
    login
}