import { literal } from "../db";
import { Sequelize, DataTypes, Model } from "sequelize";

class Favmoviedata extends Model {}

const favmovietableSchema = {
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'beginTime',
      defaultValue: literal('NOW()')
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      field: 'beginTime',
      defaultValue: literal('NOW()')
    }
};

Favmoviedata.init(favmovietableSchema, {
    sequelize,
    tableName:"favmovietable"
})

// Favmoviedata.sync({alter:true});

export default Favmoviedata;