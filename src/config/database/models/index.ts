import { User } from "./User";
import { Test } from "./Exam";
import { Question } from "./Question";
import { Option } from "./Option";
import { QuestionAnswer } from "./QuestionAnswer";
import { TestResult } from "./ExamResult";
import { Position } from "./Position";
import { ExamAccounts } from "./ExamAccounts";


User.hasMany(TestResult, { foreignKey: "userId" })
TestResult.belongsTo(User, { foreignKey: "userId" });

User.hasMany(QuestionAnswer, { foreignKey: "userId" });
QuestionAnswer.belongsTo(User, { foreignKey: "userId" });

Test.hasMany(Question, { foreignKey: "testId", as: "questions" });
Question.belongsTo(Test, { foreignKey: "testId" });

Test.hasMany(TestResult, { foreignKey: "testId", as: "results" });
TestResult.belongsTo(Test, { foreignKey: "testId" });

Question.hasMany(QuestionAnswer, { foreignKey: "questionId", as: "answers" });
QuestionAnswer.belongsTo(Question, { foreignKey: "questionId" });

Question.hasMany(Option, { foreignKey: "questionId",onDelete: 'CASCADE' ,as: "options" });
Option.belongsTo(Question, { foreignKey: "questionId" });

Option.hasMany(QuestionAnswer, { foreignKey: "optionId", as: "answers" });
QuestionAnswer.belongsTo(Option, { foreignKey: "optionId" });

Position.hasMany(User, { foreignKey: "positionId" });
User.belongsTo(Position, { foreignKey: "positionId", as: "positions" });

Position.hasMany(Test, { foreignKey: "category" });
Test.belongsTo(Position, { foreignKey: "category" });

Test.hasMany(ExamAccounts, { foreignKey: "examId", as: "accounts" });
ExamAccounts.belongsTo(Test, { foreignKey: "examId" });

User.hasMany(ExamAccounts, { foreignKey: "accountId", as: "accounts" });
ExamAccounts.belongsTo(User, { foreignKey: "accountId" });
