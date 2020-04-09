const User = require("../models/User");
const Moviesdata = require("../models/moviesdata");
const Reviewsdata = require("../models/reviewdata")
var Favmoviedata = require("../models/favtable")

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
        try {
          // user details insertion into a new row into table
          await User.create({ ...req.body });
          //jwt part starts
          const{email,password}= req.body;
          console.log("register--------------")
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
            // console.log(token);
            const url = `http://localhost:1234/confirmation/${token}`;
            await transporter.sendMail({
              to: user.email,
              subject: 'confirmation email:please verify your email id to access TOP 100 Movies',
              html:  `hi "${username}" Please click link to confirm your email: <a href="${url}">${url}</a>`,
            });
            //jwt part ends
          } 
          //try block end
          res.send("please confirm your email to access the page");
        } catch (error) {
          console.log(error);
          if (error.name === "SequelizeValidationError")
          console.log("sequelize validation error");
            return res.status(400).send(`Validation Error: ${error.message} im in register function`);
        }
      },

      async confirmation(req,res){
        try {
          // const {email}=req.body
          const { user } = jwt.verify(req.params.token, process.env.JWT_KEY);
          console.log('im here inside try after 1st line')
          console.log(user);
          console.log(" confirmation ------------")
          await User.update({ Isconfirmed: true }, { where:  {email : user}, });
          // console.log('email confirmation update success) 
          //update success
        } catch (e) {
          console.log(e.message);
          // return res.send('error didnt execute try block of confirmation');
          return res.status(400).send("Email confirmation issue");
        }
        // return res.send("didnt enter confirmation try block");
        return res.redirect(`http://localhost:1234/login`);
      },
      
    
      async loginUser(req, res) {

        // Get the users json file
        const { email, password } = req.body; 
        console.log("loginuser ----------")
        try {

        // console.log("---------------------------------") 
        // console.log(user.dataValues.Isconfirmed)
        // console.log("---------------------------------") 
        //email confimation check//
        
        if (!email || !password)
          return res.send("Incorrect credentials");
          const user = await User.findByEmailAndPassword(email, password);

          if(!user.dataValues.Isconfirmed)
        {
          return res.status(400).send('please confirm your email to login');  
         } 
          console.log("login ----------")
          await User.update({ Isactive: true }, { where:  {email : user}, });
          req.session.userId = user.dataValues.id;
          // console.log(user);
          return res.send("you have logged in successfully to access top rated 100 movies get to /home")
        } catch (err) {
          console.log(err.message);
          return res.send("incorrect credentials");
        }
      },
      
      

      async logoutUser(req,res,next){
          try{
          if(req.session){
             req.session.destroy(function(err){
              if(err){return next(err)}
              else {console.log("you have been loggedout succesfully")}
              return res.send("you have been logged out successfully")
            })
        }
        } catch (err) {
          console.log(err.message);
          res.status(500).send("server error(unable to logout)");
        }
      },
    
      async changePassword(req, res) {
        const { email, oldPassword, newPassword } = req.body;
        if (!email || !oldPassword || !newPassword)
          return res.status(400).send("Bad request");
        try {
          console.log("changepswd -----------------")
          const user = await User.findByEmailAndPassword(email, oldPassword);
          if (!user) {
            return res.status(401).send("Incorrect credentials");
          }
          await user.update({ password: newPassword });
          return res.send("please login password has been updated");
        } catch (err) {
          console.log(err.message);
          res.send("incorrect credentials");
        }
      },
    
      async deactivateAccount(req, res) {
      
        const { email } = req.body;
        if (!email) return res.status(400).send("Email is required");
        try {
          console.log("deactivate account------")
          await User.destroy({ where: { email } });
          return res.redirect("/");
        } catch (err) {
          console.log(err.message);
          res.status(500).send("Server Error");
        }
      },
      //host/-
    async allmovies(req,res){

      Moviesdata.findAll({}).then((data) => {
        const {title} = req.query;
        
        function escapeRegex(text) {
          var name = text || '';
          return name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      };
      const regex = new RegExp(escapeRegex(title), 'gi');
        res.status(200).send(data);
        // console.log(data.dataValues);
      }).catch((error) => {
        console.log(error);
      });
    },
    
    async homepage(req,res){
      // try{
      //   // Get the users json file
      // const { email, password } = req.body; 
      // const user = await User.findByEmailAndPassword(email, password);
        
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
              // console.log(data.dataValues);
            }).catch((error) => {
              console.log(error);
            });

            // Moviesdata.
      
      // } catch (error){
      //   console.log(error.message);

      // }
      
      } ,
      // async addmovie(req,res){
      //   try{
      //     const moviedetails = req.body
      //     if(!moviedetails){
      //       return res.send('Please Enter Some Required Movies Reletaed Data');
      //     }
      //     const moviedetailsdoc= await Moviesdata.create({...moviedetails})
          
      //     res.status(201).send("movie has been added",moviedetailsdoc)
      //   }catch(err){
      //     console.log(err.message);
      //     return res.send(err.message);
      //   }
      // },

      async addfavmovie(req,res){
        try{
              const {email} = req.body
              console.log("fav movie function")
              const user = await User.findOne({where:email});
              const Userid =  user.dataValues.id;
              const name =   user.dataValues.name;
              console.log(Userid)
                if(user){
                const{mid}=req.body;
                console.log(Userid)
                const favmdata = await Favmoviedata.create({
                  fk_mid : mid,
                  fk_Userid  : Userid
                });
              return res.status(200).send(`your fav movie added to your profile `);
          }else{
            return res.send("please login to add movie to your favourites")
          }
          
          }catch(error){
            console.log(error)
            return res.send(error.message)
          }

      },



      async reviewSystem(req,res) {
    
        try { 
              const {email} = req.body
              console.log("review system------")
              const user = await User.findOne({where:email});
              const Userid =  user.dataValues.id;
              const name =   user.dataValues.name;
              const useremail =  user.dataValues.email;
              

            if(user)
            {
            const {review,rate,mid} = req.body;
            console.log("beforemovie id")
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
                 
                    //update rating
                        //  where:
        //   R = average for the movie (mean) = (Rating)
        //   v = number of votes for the movie = (votes)
        //   m = minimum votes required to be listed in the Top 250 (currently 1250)
        //   C = the mean vote across the whole report (currently )
        let R = rate;
        let v = voters;
        let m = 1250;
        let C = averageVote
        console.log(voters)
        console.log(averageVote)
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
console.log(mid,inputValue)
const foundmovie =await Moviesdata.findOne({where:{mid:mid}}) 
if(foundmovie){
await foundmovie.update({vote_average:inputValue})
await foundmovie.update({vote_count:voters},{where: {mid:mid}})
}

// rating update end
              // console.log(updatedvoteavg,updatedvotecount);
                return res.status(201).send(`thank for your valuable feedback"`);
            }else{
              res.send("please login to rate and review movie")
            }
        }catch (error) {
          console.log(error.message)
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
      console.log(err.message)
      return res.status(500).send("Sorry,cannot get your details")
    }

  }

    
      
    
    
        
          
          
};