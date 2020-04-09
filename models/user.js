const sequelize = require("../db");
const { hash, compare } = require("bcryptjs");
const { Sequelize, Model } = require("sequelize");

class User extends Model {
  static async findByEmailAndPassword(email, password) {
    try {
      console.log("userextends -------------------")
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (!user) { 
        console.log("not a registered user")
        return;
      }
      const isMatched = await compare(password, user.password);
      if (!isMatched) {
        // throw new Error("Incorrect credentials");
        console.log("incorrect password");
        return ;
      }
      return user;
    } catch (err) {
      throw err;
    }
  }
}

const userSchema = {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    foreignKey:true
  },
  
  Isconfirmed:{
    type:Sequelize.BOOLEAN,
    default: false,
    allowNull: true
    
  },
  Isactive:{
    type:Sequelize.BOOLEAN,
    default: false,
    allowNull: true
    
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  city: {
    type: Sequelize.STRING,
    allowNull: false
  },
  dob: {
    type: Sequelize.STRING,
    allowNull: false
  },
  createdAt: {
    allowNull: false,
    defaultValue: new Date(),
    type: Sequelize.DATE
  },
  updatedAt: {
    allowNull: false,
    defaultValue: new Date(),
    type: Sequelize.DATE
  }

};




User.init(userSchema, {
  sequelize,
  tableName: "users"
});

// User.sync({alter:true});


User.beforeCreate(async user => {
  const hashedPassword = await hash(user.password, 10);
  user.password = hashedPassword;
});

User.beforeUpdate(async user => {
  if (user.changed("password")) {
    const hashedPassword = await hash(user.password, 10);
    user.password = hashedPassword;
  }
});

module.exports = User;