const sequelize = require("../db");
const { Sequelize,DataTypes, Model } = require("sequelize");






class Favmoviedata extends Model {}

const favmovietableSchema = {
//    userid:{
//      type:Sequelize.INTEGER,
//      allowNull:true,
//      foreignKey:true
//    },
//     title: {
//         type:Sequelize.TEXT,
//       allowNull: true,
//       // unique: true,
//       foreignKey:true

//     },
    createdAt: {
      allowNull: false,
      // defaultValue: new Date(),
      type: Sequelize.DATE,
      field: 'beginTime',
    defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      allowNull: false,
      // defaultValue: new Date(),
      type: Sequelize.DATE,
      field: 'beginTime',
    defaultValue: sequelize.literal('NOW()')
    }
  

};



Favmoviedata.init(favmovietableSchema, {
    sequelize,
    tableName:"favmovietable"
})

// Favmoviedata.sync({alter:true});

module.exports = Favmoviedata;