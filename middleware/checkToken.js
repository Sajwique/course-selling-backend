const jwt = require("jsonwebtoken");

const checkTokenMiddleware = async (req, res, next) => {
  try {
    const headers = req.headers.authorization?.split(" ");
    // console.log("headers :", headers);

    if (!headers) {
      res.status(403).json({
        message: "Please provide the access token",
      });
      return;
    }
    const token = headers[1];

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.body.custome_data = decoded?.email;
    if (decoded.id) {
      req.body.admin_id = decoded.id;
      next();
      return;
    }
    next();
  } catch (e) {
    console.log(e.message);
    res.status(403).json({
      message: e.message,
    });
  }
};

module.exports = {
  checkTokenMiddleware: checkTokenMiddleware,
};
