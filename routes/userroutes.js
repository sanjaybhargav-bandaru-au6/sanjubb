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
router.get("/login", loginUser);
router.get("/logout",logoutUser);
router.get("/confirmation/:token",confirmation);
router.get("/home",auth,homepage);
router.get("/",allmovies);
router.get("/profile",auth,profile);

// post routes
router.post("/register", registerUser);
router.post("/changepassword", auth, changePassword);
router.post("/logout",logoutUser);
router.post("/confirmation/:token",confirmation);
router.post("/rateandreview",auth,reviewSystem);
router.post("/addfavmovie",auth,addfavmovie)

//delete routes
router.delete("/delete", auth, deleteAccount);

module.exports = router;