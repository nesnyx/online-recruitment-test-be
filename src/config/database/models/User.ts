import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface UserAttributes {
    id: string;
    name: string;
    password: string;
    email: string;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> { }

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public password!: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);
