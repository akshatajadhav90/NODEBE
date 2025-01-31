const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
const pool = mysql.createPool(config);



module.exports = {
    pool,
};
