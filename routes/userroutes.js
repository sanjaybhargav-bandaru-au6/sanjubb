const { Router } = require('express');
const auth = require("../middleware/authenticate");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");

var Moviesdata = require("../models/moviesdata");
var Reviewsdata = require("../models/reviewdata")
var Favmoviedata = require("../models/favtable")
//associations/relations
Reviewsdata.belongsTo(User, {foreignKey:'fk_UserId', targetKey:'id'});
Reviewsdata.belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});
Favmoviedata.belongsTo(User, {foreignKey:'fk_Userid', targetKey:'id'});
Favmoviedata.belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});

const router = Router();
const { allmovies,
      reviewSystem,
      addreview,
      loginUser,
      registerUser,
      changePassword,
      deleteAccount,
      homepage,
      confirmation,
      logoutUser,
      addfavmovie,
      profile   
  } = require ("../controllers/usercontroller");

// get routes
router.get("api/login", loginUser);
router.get("api/logout",logoutUser);
router.get("api/confirmation/:token",confirmation);
router.get("api/home",auth,homepage);
router.get("api/",allmovies);
router.get("api/profile",auth,profile);

// post routes
router.post("api/register", registerUser);
router.post("api/changepassword", auth, changePassword);
router.post("api/logout",logoutUser);
router.post("api/confirmation/:token",confirmation);
router.post("api/rateandreview",auth,reviewSystem);
router.post("api/addfavmovie",auth,addfavmovie)

//delete routes
router.delete("api/delete", auth, deleteAccount);

module.exports = router;