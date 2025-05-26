const jwt = require("jsonwebtoken");

const checkTokenMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Access token required" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      email: decoded.email,
      id: decoded.id,
    };
    next();
  } catch (e) {
    console.error("JWT Error:", e.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = {
  checkTokenMiddleware: checkTokenMiddleware,
};
