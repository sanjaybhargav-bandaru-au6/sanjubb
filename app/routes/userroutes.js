import { Router } from 'express';
import auth from "../middleware/authenticate";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import sequelize from "sequelize";

import Moviesdata from "../../models/moviesdata";
import { belongsTo } from "../../models/reviewdata";
import { belongsTo as _belongsTo } from "../../models/favtable";
//associations/relations
belongsTo(User, {foreignKey:'fk_UserId', targetKey:'id'});
belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});
_belongsTo(User, {foreignKey:'fk_Userid', targetKey:'id'});
_belongsTo(Moviesdata, {foreignKey:'fk_mid', targetKey:'mid'});

const router = Router();
import loginUser from "../../controllers/usercontroller";
import logoutUser from "../../controllers/usercontroller";
import profile from "../../controllers/usercontroller";
import confirmation from "../../controllers/usercontroller";
import registerUser from "../../controllers/usercontroller";
import homepage from "../../controllers/usercontroller";
import changePassword from "../../controllers/usercontroller";
import allmovies from "../../controllers/usercontroller";
import reviewSystem from "../../controllers/usercontroller";
import addfavmovie from "../../controllers/usercontroller";
import deleteAccount from "../../controllers/usercontroller";


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

export default router;