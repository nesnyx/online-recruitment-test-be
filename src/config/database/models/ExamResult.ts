import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export type TestResultStatus = "ONGOING" | "SUBMITTED" | "TIMEOUT";

interface TestResultAttributes {
    id: string;
    userId: string;
    testId: string;

    startedAt: Date;
    submittedAt?: Date;

    score: number;
    correctCount: number;
    totalQuestions: number;

    status: TestResultStatus;
}

interface TestResultCreationAttributes
    extends Optional<
        TestResultAttributes,
        "id" | "submittedAt" | "score" | "correctCount"
    > { }

export class TestResult
    extends Model<TestResultAttributes, TestResultCreationAttributes>
    implements TestResultAttributes {
    public id!: string;
    public userId!: string;
    public testId!: string;

    public startedAt!: Date;
    public submittedAt?: Date;

    public score!: number;
    public correctCount!: number;
    public totalQuestions!: number;

    public status!: TestResultStatus;
}

TestResult.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        testId: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        startedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        submittedAt: {
            type: DataTypes.DATE,
        },

        score: {
            type: DataTypes.FLOAT,
            defaultValue: 0,
        },

        correctCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },

        totalQuestions: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM("ONGOING", "SUBMITTED", "TIMEOUT"),
            defaultValue: "ONGOING",
        },
    },
    {
        sequelize,
        tableName: "test_results",
        indexes: [
            {
                unique: true,
                fields: ["userId", "testId"], // 1 user = 1 hasil per test
            },
        ],
    }
);
