import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

interface QuestionAnswerAttributes {
    id: string;
    questionId: string;
    optionId: string
    userId: string
}

interface QuestionAnswerCreationAttributes
    extends Optional<QuestionAnswerAttributes, "id"> { }

export class QuestionAnswer
    extends Model<QuestionAnswerAttributes, QuestionAnswerCreationAttributes>
    implements QuestionAnswerAttributes {
    public id!: string;
    public questionId!: string;
    public optionId!: string
    public userId!: string;
}

QuestionAnswer.init(
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
        optionId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "question_answers",
    }
);