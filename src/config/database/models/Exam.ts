import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface TestAttributes {
    id: string;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    durationMinutes?: number;
    category?: string
}

interface TestCreationAttributes
    extends Optional<TestAttributes, "id" | "durationMinutes" | "category"> { }

export class Test
    extends Model<TestAttributes, TestCreationAttributes>
    implements TestAttributes {
    public id!: string;
    public title!: string;
    public description?: string;
    public startAt!: Date;
    public endAt!: Date;
    public durationMinutes?: number;
    public category!: string;
}

Test.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        description: {
            type: DataTypes.TEXT,
        },

        startAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        endAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        durationMinutes: {
            type: DataTypes.INTEGER,
            comment: "Durasi pengerjaan dalam menit (opsional)",
        },

        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        paranoid:true,
        tableName: "tests",
    }
);
