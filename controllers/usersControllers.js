const { pool } = require("../config/database");

exports.add = async (req, res) => {
  const { name, profession, age, gender } = req.body;
  const query =
    "INSERT INTO users (name,profession,age,gender) VALUES(?,?,?,?)";
  try {
    const values = await pool.query(query, [name, profession, age, gender]);

    return res
      .status(201)
      .json({ message: "User Added successfully", users: values });
  } catch (e) {
    return res.status(500).json({ message: e });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { search, sortBy = "createdAt", sortOrder = "DESC", page = 1, limit = 10 } = req.query;

    let query = "SELECT * FROM users";
    const params = [];

    // Apply search
    if (search) {
      query += " WHERE CONCAT_WS(' ', name, profession, age, gender) LIKE ?";
      params.push(`%${search}%`);
    }

    // Apply sorting
    const validSortColumns = ["name", "profession", "age", "gender", "createdAt"];
    if (validSortColumns.includes(sortBy)) {
      query += ` ORDER BY ${sortBy} ${sortOrder === "DESC" ? "DESC" : "ASC"}`;
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), offset);

    // Execute the query
    const [value] = await pool.query(query, params);

    // Fetch total count for pagination metadata
    const [countResult] = await pool.query("SELECT COUNT(*) as total FROM users");
    const total = countResult[0].total;

    return res.status(200).json({
      message: "Users fetched successfully",
      users: value
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateUsers = async (req, res) => {
  const { name, profession, age, gender } = req?.body;
  const { id } = req?.params;
  console.log(id);
  try {
    const selectQuery = "Select * from users where id=?";
    const [rows] = await pool.query(selectQuery, [id]);

    if (!rows.length) {
      res.status(400).json({ message: "Users does not exist for Update" });
    }

    const updateQuery =
      "UPDATE users SET name = ?,profession = ?,age = ?,gender = ? where id = ? ";
    const result = await pool.query(updateQuery, [
      name,
      profession,
      age,
      gender,
      id,
    ]);

    return res
      .status(200)
      .json({ message: "Users Data Updated Successfully", users: result });
  } catch (e) {
    return res.status(400).status({ message: e });
  }
};

exports.deletUsers = async (req, res) => {
  const { id } = req?.params;

  try {
    const query = "select * from users where id=?";
    const [isUserExists] = await pool.query(query, [id]);
    if (!isUserExists.length) {
      return res
        .status(400)
        .json({
          message: "User Cannot be delete because user id does not exist",
        });
    }

    const deleteQuery = "delete from users where id=?";
    const value = await pool.query(deleteQuery, [id]);

    return res
      .status(200)
      .json({ message: "User Deleted SuccessFully", users: value });
  } catch (e) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// exports.searchUsers = async (req, res) => {
//     const { name } = req.body
//     const query = "Select * from users";

//     try {
//         const [value] = await pool.query(query);

//         const val = value.filter((ele) => ele.name.includes(name));
//         console.log(val, name)
//         res.status(200).json({ message: "Search Result", val })
//     }
//     catch (e) {
//         res.status(400).json({ message: "Server Error" })
//     }
// }

// exports.sorting = async (req, res) => {
//     const { type } = req.body;

//     const query = "Select * from users"
//     try {
//         const [sortValue] = await pool.query(query);
//         console.log(sortValue?.sort((a, b) => b.name - a.name))
//         if (typeof (type) === String) {

//             return res.status(200).json({ messagxe: "Data sorted Successfully", response: sortValue?.sort((a, b) => a[type].localeCompare(b[type])) })
//         }
//         else {
//             return res.status(200).json({ messagxe: "Data sorted Successfully", response: sortValue?.sort((a, b) => a[type] - b[type])
//         })

//     }
//     }
//     catch (e) {
//     res.status(400).json({ message: "Server Error" })
// }

// }
