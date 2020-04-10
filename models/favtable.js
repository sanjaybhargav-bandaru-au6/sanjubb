const sequelize = require("../db");
const { Sequelize,DataTypes, Model } = require("sequelize");

class Favmoviedata extends Model {}

const favmovietableSchema = {
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

Favmoviedata.init(favmovietableSchema, {
    sequelize,
    tableName:"favmovietable"
})

// Favmoviedata.sync({alter:true});

module.exports = Favmoviedata;