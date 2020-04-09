const { Router } = require('express');
const auth = require("../middleware/authenticate");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sequelize = require("sequelize");


var Moviesdata = require("../models/moviesdata");
var Reviewsdata = require("../models/reviewdata")
var Favmoviedata = require("../models/favtable")
// Reviewsdata.belongsTo(Moviesdata,{as:'userreview'});
// Moviesdata.hasMany(User);
// User.hasMany(Reviewsdata);
// Reviewsdata.hasMany(User);
// User.belongsToMany(Reviewsdata, { through: Moviesdata });
Reviewsdata.belongsTo(User, {foreignKey:'fk_UserId', targetKey:'id'});
Reviewsdata.belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});
Favmoviedata.belongsTo(User, {foreignKey:'fk_Userid', targetKey:'id'});
Favmoviedata.belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});

// Reviewsdata.hasMany(User, {as: ''})
// Moviesdata.belongsToMany(User, { through: Reviewsdata });


 
const router = Router();
const { allmovies,
      reviewSystem,
      addreview,
      loginUser,
     registerUser,
     changePassword,
     deactivateAccount,
     homepage,
     confirmation,
     logoutUser,
     addfavmovie,
     profile
     
     
  } = require ("../controllers/usercontroller");



// get routes
router.get("/login", loginUser);
router.get("/register", registerUser);
router.get("/change-password", auth, changePassword);
router.get("/deactivate", auth, deactivateAccount);
router.get("/logout",logoutUser);
router.get("/confirmation/:token",confirmation);
router.get("/home",auth,homepage);
router.get("/",allmovies);
router.get("/rateandreview",auth,reviewSystem);
router.get("/profile",auth,profile);


// DB routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/change-password", auth, changePassword);
router.post("/deactivate", auth, deactivateAccount);
router.post("/logout",logoutUser);
router.post("/confirmation/:token",confirmation);
router.post("/rateandreview",auth,reviewSystem);
router.post("/addfavmovie",auth,addfavmovie)

// router.post('/logout', function(req, res, next) {
//   if (req.session) {
//     console.log(req.session.id);
//     // delete session object
//     req.session.destroy(function(err) {
//       if(err) {
//         return next(err);
//       } else {
//         console.log("you have been logged out succesfully");
//         return res.redirect('/login');
//       }
//     });
//   }
// });


module.exports = router;