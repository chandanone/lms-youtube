import User from "./User";
import Course from "./Course";
import Chapter from "./Chapter";
import Video from "./Video";
import Enrollment from "./Enrollment";
import Progress from "./Progress";
import Quiz from "./Quiz";
import QuizQuestion from "./QuizQuestion";
import QuizAttempt from "./QuizAttempt";
import Testimonial from "./Testimonial";
import Certificate from "./Certificate";

import sequelize from "@/lib/db";

// Define associations
User.hasMany(Course, { foreignKey: "instructorId", as: "courses" });
Course.belongsTo(User, { foreignKey: "instructorId", as: "instructor" });

Course.hasMany(Chapter, { foreignKey: "courseId", as: "chapters" });
Chapter.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Chapter.hasMany(Video, { foreignKey: "chapterId", as: "videos" });
Video.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

Chapter.hasOne(Quiz, { foreignKey: "chapterId", as: "quiz" });
Quiz.belongsTo(Chapter, { foreignKey: "chapterId", as: "chapter" });

Quiz.hasMany(QuizQuestion, { foreignKey: "quizId", as: "questions" });
QuizQuestion.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

User.hasMany(Enrollment, { foreignKey: "userId", as: "enrollments" });
Enrollment.belongsTo(User, { foreignKey: "userId", as: "user" });

Course.hasMany(Enrollment, { foreignKey: "courseId", as: "enrollments" });
Enrollment.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Progress, { foreignKey: "userId", as: "progress" });
Progress.belongsTo(User, { foreignKey: "userId", as: "user" });

Video.hasMany(Progress, { foreignKey: "videoId", as: "progress" });
Progress.belongsTo(Video, { foreignKey: "videoId", as: "video" });

Course.hasMany(Progress, { foreignKey: "courseId", as: "progress" });
Progress.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(QuizAttempt, { foreignKey: "userId", as: "quizAttempts" });
QuizAttempt.belongsTo(User, { foreignKey: "userId", as: "user" });

Quiz.hasMany(QuizAttempt, { foreignKey: "quizId", as: "attempts" });
QuizAttempt.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

User.hasMany(Testimonial, { foreignKey: "userId", as: "testimonials" });
Testimonial.belongsTo(User, { foreignKey: "userId", as: "user" });

Course.hasMany(Testimonial, { foreignKey: "courseId", as: "testimonials" });
Testimonial.belongsTo(Course, { foreignKey: "courseId", as: "course" });

User.hasMany(Certificate, { foreignKey: "userId", as: "certificates" });
Certificate.belongsTo(User, { foreignKey: "userId", as: "user" });

Enrollment.hasOne(Certificate, {
  foreignKey: "enrollmentId",
  as: "certificate",
});
Certificate.belongsTo(Enrollment, {
  foreignKey: "enrollmentId",
  as: "enrollment",
});

Course.hasMany(Certificate, { foreignKey: "courseId", as: "certificates" });
Certificate.belongsTo(Course, { foreignKey: "courseId", as: "course" });

console.log("Registered models in registry:", Object.keys(sequelize.models));

export {
  User,
  Course,
  Chapter,
  Video,
  Enrollment,
  Progress,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  Testimonial,
  Certificate,
};
