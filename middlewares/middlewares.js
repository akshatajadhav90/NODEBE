const jwt = require("jsonwebtoken");


exports.authMiddleWre = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization Token is Required" })
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
        next();

    }
    catch (e) {
        console.log("Token verification failed:", e);
        res.status(401).json({ message: "Invalid or Expired token" })
    }

};

