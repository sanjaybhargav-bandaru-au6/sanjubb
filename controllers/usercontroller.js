const User = require("../models/User");
const Moviesdata = require("../models/moviesdata");
const Reviewsdata = require("../models/reviewdata")
var Favmoviedata = require("../models/favtable")
const { hash, compare } = require("bcryptjs");

const { Op } = require("sequelize");
const auth = require("../middleware/authenticate");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

module.exports = {  
      async registerUser(req, res) {
        // function for user registration
        try {
          // email unique check
          const{email,password}= req.body;
          const user_existing = await User.findOne({where:{email:email}});
          if(user_existing){
            return res.send("Already registered user");
          }
          // user details insertion into a new row into table
          await User.create({ ...req.body });
          //jwt part starts
          // for finding the user from db with respect to data entered(email and password)
          const user = await User.findByEmailAndPassword(email,password);
          username = user.dataValues.name;
          if(user){
            const token = jwt.sign(
            {
              user:user.email,
            },
            process.env.JWT_KEY,{
              expiresIn:"24h"
            }
            )
            const url = `http://localhost:1234/confirmation/${token}`;
            await transporter.sendMail({
              to: user.email,
              subject: 'confirmation email:please verify your email id to access TOP 100 Movies',
              html:  `hi "${username}" Please click link to confirm your email: <a href="${url}">${url}</a>`,
            });
            //jwt part ends
          } 
          //try block end
          res.status(201).send("please confirm your emailid to get access ");
        } catch (error) {
          if (error.name === "SequelizeValidationError")
            return res.status(400).send(`Validation Error: ${error.message} im in register function`);
        }
      },

      async confirmation(req,res){
        try {
          const { user } = jwt.verify(req.params.token, process.env.JWT_KEY);
          await User.update({ Isconfirmed: true }, { where:  {email : user}, });
          //update success
        } catch (e) {
          return res.status(400).send("Email confirmation issue");
        }
        return res.send("your email has been verified please login");
      },
      
      async loginUser(req, res) {
        // Get the users json file
        const { email, password } = req.body;
        try {
          if (!email || !password)
            return res.send("Incorrect credentials");
            const user = await User.findByEmailAndPassword(email, password);
            if(!user.dataValues.Isconfirmed)
          {
            return res.status(400).send('please confirm your email to login');  
          } 
            await User.update({ Isactive: true }, { where:  {email : user.dataValues.email}, });
            req.session.userId = user.dataValues.id;
            return res.send("you have logged in successfully to access top rated 100 movies get to /home")
        } catch (err) {
          return res.send("incorrect credentials");
        }
      },

      async logoutUser(req,res,next){
        try{
          if(req.session.userId){
            await User.update({ Isactive: false }, { where:  {id : req.session.userId}, });
             req.session.destroy(function(err){
              if(err){return next(err)}
              return res.send("you have been logged out successfully")
            })
          }
          else{
            return res.send("Please login to access this page")
          }
        } catch (err) {
          res.status(500).send("server error(unable to logout)");
        }
      },
    
      async changePassword(req, res) {
        const { oldPassword, newPassword } = req.body;
        if ( !oldPassword || !newPassword)
          return res.status(400).send("Bad request");
        try {
          const user = await User.findOne({where :{ id :req.session.userId}});
          if (!user) {
            return res.status(401).send("Incorrect credentials");
          } 
          const ismatched = await compare(oldPassword, user.password)
          if (!ismatched){
            return res.status(401).send("Incorrect credentials");
          }         
          if (oldPassword == newPassword){
            return res.send("New password cannot be same the previous password.")
          }
          await user.update({ password: newPassword });
          return res.send("Your password has been updated successfully.");
        } catch (err) {
          res.send("incorrect credentials");
        }
      },
    
      async deleteAccount(req, res) {
        if (!req.session.userId) return res.status(400).send("Please login to access this page");
        try {
          await User.destroy({ where: { id : req.session.userId } });
          await Favmoviedata.destroy({ where: { fk_Userid : req.session.userId } });
          await Reviewsdata.destroy({ where: { fk_UserId : req.session.userId } });
          return res.status(204).send("your account has been deleted");
        } catch (err) {
          res.status(500).send("Server Error");
        }
      },

    async allmovies(req,res){
      Moviesdata.findAll({}).then((data) => {
        const {title} = req.query;
        function escapeRegex(text) {
          var name = text || '';
          return name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      };
      const regex = new RegExp(escapeRegex(title), 'gi');
        res.status(200).send(data);
      }).catch((error) => {
        console.log(error);
      });
    },
    
    // protected route home page accessible after login
    async homepage(_,res){
      Moviesdata.findAll({
              where:{
                // for geners specification
              //   geners :{[Op.substring]:'Action',
              //   [Op.substring]:'Adventure',
              //   [Op.substring]:'Crime',
              //   [Op.substring]:'Mystery',
              //   [Op.substring]:'Science Fiction',
              //   [Op.substring]:'Family',
              //   [Op.substring]:'Fantasy',
              //   [Op.substring]:'Animation'

              // },
                // for rating above 7.5
                 vote_average :{
                   [Op.gte]:7.5}  }
                  }).then((data) => {
              res.status(200).send(data);
            }).catch((error) => {
              console.log(error);
            });
      } ,

      async addfavmovie(req,res){
        try{
          const user = await User.findByPk(req.session.userId);
          const Userid =  user.dataValues.id;
          const name =   user.dataValues.name;
          if(user){
            const{mid}=req.body;
            const existing_fav = await Favmoviedata.findOne({where:{fk_mid:mid, fk_Userid:Userid}})
            if (existing_fav){
              return res.send("This movie is already added as your favourite")
            }
            const favmdata = await Favmoviedata.create({
              fk_mid : mid,
              fk_Userid  : Userid
            });
            return res.status(201).send(`your fav movie added to your profile `);
          }else{
            return res.send("please login to add movie to your favourites")
          }
          }catch(error){
            return res.send(error.message)
          }
      },

      async reviewSystem(req,res) {   
        try { 
            const user = await User.findByPk(req.session.userId);
            if(user){
              const Userid =  user.dataValues.id;
              const name =   user.dataValues.name;
              const useremail =  user.dataValues.email;
              const {review,rate,mid} = req.body;
              const existing_review = await Reviewsdata.findOne({where:{ fk_mid : mid, fk_UserId : Userid}});
              if (existing_review){
                return res.send("You have already sbmitted review for this movie")
              }
              const reviewerData = await Reviewsdata.create({
                    fk_mid : mid,
                    fk_UserId  : Userid,
                    name: name,
                    email: useremail,
                    review:review,
                    rate:rate
                });
              // rating update system start
              let {vote_count,vote_average}=await Moviesdata.findOne({where:{mid:mid}})
              let averageVote = parseInt(vote_average)                  
              let voters =parseInt( vote_count);

              //   R = average for the movie (mean) = (Rating)
              //   v = number of votes for the movie = (votes)
              //   m = minimum votes required to be listed in the Top 250 (currently 1250)
              //   C = the mean vote across the whole report (currently )
              let R = rate;
              let v = voters;
              let m = 1250;
              let C = averageVote
              var rank  = (v / (v+m)) * R + (m / (v+m)) * C;
              var inputValue=rank.toString()           
              var afterDot = '';
              var beforeDots = inputValue.split('.'); 
              var beforeDot = beforeDots[0];
              if(beforeDots[1]){
                var afterDot = beforeDots[1];
                  if(afterDot.length > 3 ){
                    afterDot = afterDot.slice(0, 2);               
                   }
                afterDot = '.'+ afterDot;
              }
              if(beforeDot){                  
                  if(beforeDot.length > 6 ){          
                      beforeDot = beforeDot.slice(0, 6);                      
                  }
                  if(beforeDots[1] == ''){
                      beforeDot = beforeDot + '.';
                  }
              }
              inputValue = beforeDot + afterDot;
              voters =parseInt( vote_count)+1
              const foundmovie =await Moviesdata.findOne({where:{mid:mid}}) 
              if(foundmovie){
                await foundmovie.update({vote_average:inputValue})
                await foundmovie.update({vote_count:voters},{where: {mid:mid}})
              }
              return res.status(201).send(`thank for your valuable feedback"`);
            }else{
              res.send("please login to rate and review movie")
            }
        }catch (error) {
          return res.send(error.message) ;
        }
  },

  async profile(req,res){
    try{
      if (req.session.userId) {
        const user = await User.findByPk(req.session.userId);
        if (!user) return res.status(400).send("no user logged in");
        let name = user.dataValues.name;
        let email=user.dataValues.email;
        let city = user.dataValues.city;
        let dob = user.dataValues.dob;
        let userid = user.dataValues.id;
        const favmovie = await Favmoviedata.findAll({where :{fk_Userid :userid}})
        let favourite_movies=[]
        for (let i=0;i<favmovie.length;i++){
          let x = await Moviesdata.findOne({where:{ mid: favmovie[i].dataValues.fk_mid}})
          favourite_movies.push(x.dataValues.title)
        }
        const profileDetails = {name,email,city,dob,favourite_movies} ;
        if(user){
          return res.status(200).send(profileDetails);
        }else{
          return res.send("please login to view the profile")
        }
      }
    }catch(err){
      return res.status(500).send("Sorry,cannot get your details")
    }
  }        
};