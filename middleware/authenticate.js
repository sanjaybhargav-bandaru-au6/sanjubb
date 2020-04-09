var User = require("../models/User");

module.exports = async (req, res, next) => {
  
  console.log('Authentication Processing')
  try {
    if (req.session.userId) {
      var hour = 3600000;
      req.session.cookie.maxAge = 14*24*hour;
      const user = await User.findByPk(req.session.userId);
      if (!user) return res.status(400).send("no user logged in");
      req.user = user.dataValues;
      return next();
    }
    return res.status(400).send("please login to access this page")
  } catch (err) {
    console.log(err.message);
    res.send(err.message);
  }
};
