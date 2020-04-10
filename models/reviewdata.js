const sequelize = require("../db");
const { Sequelize,DataTypes, Model } = require("sequelize");

class Reviewsdata extends Model {}

const reviewdataSchema = {
   name:{
     type:Sequelize.TEXT,
     allowNull:true,
     foreignKey:true
   },
    email: {
      type:Sequelize.TEXT,
      allowNull: true,
      foreignKey:true
    },
    review: {
      type:Sequelize.TEXT,
      allowNull: true,
      foreignKey:true
    },
    rate: {
      type:Sequelize.DOUBLE,
      allowNull: true,
      foreignKey:true
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'beginTime',
      defaultValue: sequelize.literal('NOW()')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'beginTime',
      defaultValue: sequelize.literal('NOW()')
    }
};

Reviewsdata.init(reviewdataSchema, {
    sequelize,
    tableName:"Moviereviews"
})

module.exports = Reviewsdata;