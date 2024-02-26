import { DataTypes } from "sequelize";
import { sequelize } from "../db/conexion.js";

export const TypeUsersModel = sequelize.define("cine",{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lugar: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cine: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },
},{
    timestamps:false
  }

)
