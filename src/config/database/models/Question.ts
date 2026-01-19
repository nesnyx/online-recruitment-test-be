import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface QuestionAttributes {
    id: string;
    testId: string;
    text: string;
}

interface QuestionCreationAttributes
    extends Optional<QuestionAttributes, "id"> { }

export class Question
    extends Model<QuestionAttributes, QuestionCreationAttributes>
    implements QuestionAttributes {
    public id!: string;
    public testId!: string;
    public text!: string;
}

Question.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        testId: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:"tests",
                key:"id"
            }
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "questions",
    }
);
