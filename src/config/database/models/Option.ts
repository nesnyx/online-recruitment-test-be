import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface OptionAttributes {
    id: string;
    questionId: string;
    text: string;
    isCorrect: boolean;
}

interface OptionCreationAttributes
    extends Optional<OptionAttributes, "id"> { }

export class Option
    extends Model<OptionAttributes, OptionCreationAttributes>
    implements OptionAttributes {
    public id!: string;
    public questionId!: string;
    public text!: string;
    public isCorrect!: boolean;
}

Option.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        questionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isCorrect: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "options",
    }
);
