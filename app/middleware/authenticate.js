var User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    if (req.session.userId) {
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24;
      const user = await User.findByPk(req.session.userId);
      if (!user) return res.status(400).send("no user logged in");
      req.user = user.dataValues;
      return next();
    }
    return res.status(400).send("please login to access this page")
  } catch (err) {
    res.send(err.message);
  }
};