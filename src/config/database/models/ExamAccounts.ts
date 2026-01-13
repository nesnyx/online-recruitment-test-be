import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";


interface ExamAccountsAttributes {
    id: string;
    examId: string;
    accountId: string;
}

interface ExamAccountsCreationAttributes
    extends Optional<
        ExamAccountsAttributes,
        "id"
    > { }

export class ExamAccounts
    extends Model<ExamAccountsAttributes, ExamAccountsCreationAttributes>
    implements ExamAccountsAttributes {
    public id!: string;
    public examId!: string;
    public accountId!: string;
}

ExamAccounts.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        examId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        accountId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "exam_accounts",
    }
);
