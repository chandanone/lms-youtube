import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface QuizQuestionAttributes {
  id: string;
  quizId: string;
  type: 'mcq' | 'flipcard';
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QuizQuestionCreationAttributes extends Optional<QuizQuestionAttributes, 'id' | 'options' | 'explanation'> {}

class QuizQuestion extends Model<QuizQuestionAttributes, QuizQuestionCreationAttributes> implements QuizQuestionAttributes {
  declare id: string;
  declare quizId: string;
  declare type: 'mcq' | 'flipcard';
  declare question: string;
  declare options: string[] | null;
  declare correctAnswer: string;
  declare explanation: string | null;
  declare order: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

QuizQuestion.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quizId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'quizzes',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    type: {
      type: DataTypes.ENUM('mcq', 'flipcard'),
      allowNull: false,
      comment: 'MCQ: Multiple Choice Question, Flipcard: Terminology flip card',
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    options: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
      comment: 'Array of options for MCQ type questions',
    },
    correctAnswer: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Optional explanation shown after answering',
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'quiz_questions',
    timestamps: true,
    indexes: [
      {
        fields: ['quizId', 'order'],
      },
      {
        fields: ['type'],
      },
    ],
  }
);

export default QuizQuestion;
