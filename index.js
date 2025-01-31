const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool } = require("./config/database");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user")
require("dotenv").config();


const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

    (async () => {
        try {
            const connection = await pool.getConnection();
            console.log("Connected to mysql");
            connection.release();
        }
        catch (e) {
            console.error("MySQL Connection Failed:", e);
        }
    })()

app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`)
})
