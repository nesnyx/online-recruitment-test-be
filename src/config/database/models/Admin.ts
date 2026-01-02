import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";


interface AdminAttributes {
    id: string;
    username: string;
    password: string;
}

interface AdminCreationAttributes
    extends Optional<AdminAttributes, "id"> { }

export class Admin
    extends Model<AdminAttributes, AdminCreationAttributes>
    implements AdminAttributes {
    public id!: string;
    public username!: string;
    public password!: string;
}

Admin.init(
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
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "admins",
    }
);
