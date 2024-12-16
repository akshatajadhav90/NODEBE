const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");
require("dotenv").config();

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
        expiresIn: "9h",
      }
    );

    console.log("token----------------",token)
    return res.status(200).json({ message: "Login Successfully", token });
  } catch (e) {
    res.status(500).json({ message: e });
  }
};
