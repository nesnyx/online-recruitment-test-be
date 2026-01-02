import { User } from "./User";
import { Test } from "./Exam";
import { Question } from "./Question";
import { Option } from "./Option";
import { QuestionAnswer } from "./QuestionAnswer";
import { TestResult } from "./ExamResult";


User.hasMany(TestResult, { foreignKey: "userId" })
TestResult.belongsTo(User, { foreignKey: "userId" });

User.hasMany(QuestionAnswer, { foreignKey: "userId" });
QuestionAnswer.belongsTo(User, { foreignKey: "userId" });

Test.hasMany(Question, { foreignKey: "testId" });
Question.belongsTo(Test, { foreignKey: "testId" });

Test.hasMany(TestResult, { foreignKey: "testId" });
TestResult.belongsTo(Test, { foreignKey: "testId" });

Question.hasMany(QuestionAnswer, { foreignKey: "questionId" });
QuestionAnswer.belongsTo(Question, { foreignKey: "questionId" });

Question.hasMany(Option, { foreignKey: "questionId" });
Option.belongsTo(Question, { foreignKey: "questionId" });

Option.hasMany(QuestionAnswer, { foreignKey: "optionId" });
QuestionAnswer.belongsTo(Option, { foreignKey: "optionId" });