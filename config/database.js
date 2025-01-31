const mysql = require("mysql2/promise");
require("dotenv").config();

const mysql_url = `mysql://root:dXcnYTotpIHdqWipEhdRrRNiYGyrgJak@mysql.railway.internal:3306/railway`

const pool = mysql.createPool(mysql_url);

module.exports = {
    pool,
};
