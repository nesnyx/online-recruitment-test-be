import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface TestAttributes {
    id: string;
    title: string;
    description?: string;
    startAt: Date;
    endAt: Date;
    durationMinutes?: number;
}

interface TestCreationAttributes
    extends Optional<TestAttributes, "id" | "durationMinutes"> { }

export class Test
    extends Model<TestAttributes, TestCreationAttributes>
    implements TestAttributes {
    public id!: string;
    public title!: string;
    public description?: string;
    public startAt!: Date;
    public endAt!: Date;
    public durationMinutes?: number;
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
    },
    {
        sequelize,
        tableName: "tests",
    }
);
