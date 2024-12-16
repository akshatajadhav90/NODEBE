const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
require("dotenv").config();

// Mock Database (replace with a real database)
const users = [];

//............mock data............
// exports.signup = async (req, res) => {
//   const { username, password } = req.body;

//   const existingUser = users?.find((ele) => ele["user_name"] === username);
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     users.push({ id: Date.now(), user_name: username, password: hashedPassword });
//     res.status(201).json({ message: "User registered successfully" })
//   }
//   catch (e) {
//     res.status(400).json({ message: "server error" })
//   }
// };



// ............mock data............
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   console.log(username, users)

//   try {
//     const isUserExists = users.find((ele) => ele["user_name"] === username);
//     console.log(isUserExists)
//     if (!isUserExists) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const passwordMatched = await bcrypt.compare(password, isUserExists.password);

//     if (!passwordMatched) {
//       return res.status(400).json({ message: "Incorrect password" })
//     }

//     const token = jwt.sign(
//       { id: isUserExists.id, username: isUserExists.name },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );
//     return res.status(200).json({ message: "Login Successfully", token })


//   } catch (e) {
//     return res.status(400).json({ message: "Server Error" })
//   }
// };




exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const query = "Select * from signup where user_name=?";

  try {
    const [value] = await pool.query(query, username);
    const existingUser = value?.find(
      (userDetails) => userDetails["user_name"] === username
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const queryForInsert = "Insert INTO signup (user_name,password,email) Values (?,?,?)";
  try {
    const values = await pool.query(queryForInsert, [username, hashedPassword, email]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  const query = "Select * from  signup where email=?";

  try {
    const [values] = await pool.query(query, [email]);

    const isUserExists = values?.find((ele) => ele.email === email);
    if (!isUserExists) {
      return res.status(404).json({ message: "User not found" });
    }



    const passwordMatched = await bcrypt.compare(
      password,
      isUserExists.password
    );
    console.log(passwordMatched);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: isUserExists.id, username: isUserExists.user_name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({ message: "Login Successfully", token });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};
