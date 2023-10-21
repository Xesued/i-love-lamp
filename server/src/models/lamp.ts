import {
  Attributes,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../setupMariaDB"

export class LampModel extends Model<
  InferAttributes<LampModel>,
  InferCreationAttributes<LampModel>
> {
  // "Declare" so no class properites are emitted
  declare guid: CreationOptional<string>
  declare name: string
  declare currentIP: string
  declare macAddress: string
  declare numOfLeds: number
}

LampModel.init(
  {
    guid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.TEXT, allowNull: false },
    currentIP: { type: DataTypes.CHAR, allowNull: false },
    macAddress: { type: DataTypes.CHAR, allowNull: false },
    numOfLeds: { type: DataTypes.SMALLINT, allowNull: false },
  },
  {
    tableName: "devices",
    sequelize,
  }
)

export type ILamp = Attributes<LampModel>
