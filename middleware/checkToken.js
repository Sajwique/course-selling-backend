const jwt = require("jsonwebtoken");

const checkToken = async (req, res, next) => {
  try {
    const headers = req.headers.authorization.split(" ");
    const token = headers[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.custome_data = decoded?.email;
    next();
  } catch (e) {
    console.log(e.message);
    res.status(403).json({
      message: e.message,
    });
  }
};

module.exports = {
  checkToken: checkToken,
};
