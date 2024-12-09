const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
require("dotenv").config();

// Mock Database (replace with a real database)
const signup = [];

//............mock data............
// exports.signup = async (req, res) => {
//   const { username, password } = req.body;

//   const existingUser = signup?.find((ele) => ele["username"] === username);
//   if (existingUser) {
//     return res.status(400).json({ message: "User already exists" });
//   }

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     signup.push({ id: Date.now(), username: username, password: hashedPassword });
//     res.status(201).json({ message: "User registered successfully" })
//   }
//   catch (e) {
//     res.status(400).json({ message: "server error" })
//   }
// };



// ............mock data............
// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   console.log(username, signup)

//   try {
//     const isUserExists = signup.find((ele) => ele["username"] === username);
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

  const query = "Select * from signup where email=?";

  try {
    const [value] = await pool.query(query, email);
    const existingUser = value?.find(
      (userDetails) => userDetails["email"] === email
    );

    if (existingUser) {
      return res.status(400).json({
        message: "User with email already exists",
      });
    }
  } catch (e) {
    return res.status(400).json({
      message: e,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const queryForInsert = "Insert INTO signup (username, email, password) Values (?,?,?)";
  try {
    const values = await pool.query(queryForInsert, [username, email, hashedPassword]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    return res.status(500).json({ message: e});
  }
};



exports.login = async (req, res) => {
    console.log("-------------------------")
  const { email, password } = req.body;

  const query = "Select * from  signup where email=?";

  try {
    const [values] = await pool.query(query, [email]);

    const isUserExists = values?.find((ele) => ele.email === email);
    if (!isUserExists) {
      return res.status(404).json({ message: "email not found" });
    }

    console.log("isUserExists----------",isUserExists)

    const passwordMatched = await bcrypt.compare(
      password,
      isUserExists.password
    );
    console.log(passwordMatched);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: isUserExists.id, email: isUserExists.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    console.log("token----------------",token)
    return res.status(200).json({ message: "Login Successfully", token });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};
