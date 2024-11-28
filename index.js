// const express = require("express");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const { pool } = require("./config/database");
// const authRoutes = require("./routes/auth")

// const app = express();


// app.use(cors());
// app.use(bodyParser.json()); // Parse JSON bodies
// app.use('/api/auth', authRoutes); // Routes for authentication

//     (async () => {
//         try {
//             const connection = await pool.getConnection();
//             console.log("connected to mysql");
//             connection.release();
//         } catch (e) {
//             console.error("MySQL Connection Failed:", e);
//         }
//     })();

// app.listen(4008, () => {
//     console.log("Server running at 4008")
// })


const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { pool } = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express()

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);

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

app.listen(4008, () => {
    console.log("Server running at 4008")
})
