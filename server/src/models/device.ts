import {
  Attributes,
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize"

import { sequelize } from "../setupMariaDB"

export class DeviceModel extends Model<
  InferAttributes<DeviceModel>,
  InferCreationAttributes<DeviceModel>
> {
  // "Declare" so no class properites are emitted
  declare guid: CreationOptional<string>
  declare name: string
  declare description: string
  declare currentIP: string
  declare macAddress: string
  declare numOfLeds: number
}

DeviceModel.init(
  {
    guid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.TEXT },
    currentIP: { type: DataTypes.CHAR, allowNull: false },
    macAddress: { type: DataTypes.CHAR, allowNull: false },
    numOfLeds: { type: DataTypes.SMALLINT, allowNull: false },
  },
  {
    tableName: "devices",
    sequelize,
  }
)

export type IDevice = Attributes<DeviceModel>
