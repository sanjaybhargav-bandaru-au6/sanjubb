const sequelize = require("../db");
const { Sequelize, Model } = require("sequelize");

class Moviesdata extends Model {}

const moviesdataSchema = {
    budget:{
      type:Sequelize.BIGINT,
      allowNull: true
    },
    geners:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    homepage:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    keywords:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    original_language:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    original_title:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    popularity:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    production_companies:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    production_countries:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    release_date:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    revenue:{
      type:Sequelize.DOUBLE,
      allowNull: true
    },
    runtime:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    spoken_language:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    status:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    tagline:{
      type:Sequelize.TEXT,
      allowNull: true
    },
    title:{
      type:Sequelize.TEXT,
      allowNull: true,
      // unique:true,
      foreignKey:true
    },
    vote_average:{
      type:Sequelize.DOUBLE,
      allowNull: true,
      foreignKey:true
    },
    vote_count:{
      type:Sequelize.DOUBLE,
      allowNull: true,
      foreignKey:true
    },
    mid:{
      type:Sequelize.DOUBLE,
      allowNull: false,
      unique: true,
      foreignKey:true,
      primaryKey: true
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

  Moviesdata.init(moviesdataSchema, {
    sequelize,
    tableName: "moviesdata"
  });

  // Moviesdata.sync({alter:true});
 module.exports = Moviesdata;