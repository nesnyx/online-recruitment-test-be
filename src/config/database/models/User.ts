import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface UserAttributes {
    id: string;
    username: string;
    name: string;
    password: string;
    email: string;
    positionId?: string;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, "id"> { }

export class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: string;
    public username!: string;
    public name!: string;
    public email!: string;
    public password!: string;
    public positionId!: string;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
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
        positionId: {
            type: DataTypes.UUID,
            allowNull: true,
            defaultValue: null,
            references:{
                model:"positions",
                key:"id"
            }
        },
    },
    {
        sequelize,
        tableName: "users",
    }
);
