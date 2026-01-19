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
            references:{
                model:"questions",
                key:"id"
            }
        },
        optionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:"options",
                key:"id"
            }
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references:{
                model:"users",
                key:"id"
            }
        },
    },
    {
        sequelize,
        tableName: "question_answers",
        indexes: [
            {
                unique: true,
                fields: ['userId', 'questionId'],
                name: 'unique_user_answer_per_question'
            }
        ]
    }
);