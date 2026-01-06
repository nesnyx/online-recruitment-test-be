import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface PositionAttributes {
    id: string;
    name: string;
}

interface PositionCreationAttributes
    extends Optional<PositionAttributes, "id"> { }


export class Position
    extends Model<PositionAttributes, PositionCreationAttributes>
    implements PositionAttributes {
    declare id: string;
    declare name: string;
}

Position.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    tableName: "positions"
})
