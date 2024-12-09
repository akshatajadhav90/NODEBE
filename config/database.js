const mysql = require("mysql2/promise");

const config = {
    user: "root",
    password: "root",
    host: "127.0.0.1",
    port: "3306",
    database: "users",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const pool = mysql.createPool(config);



module.exports = {
    pool,
};
