import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface QuizAttemptAttributes {
  id: string;
  userId: string;
  quizId: string;
  answers: Record<string, string>;
  score: number;
  passed: boolean;
  completedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QuizAttemptCreationAttributes extends Optional<QuizAttemptAttributes, 'id'> {}

class QuizAttempt extends Model<QuizAttemptAttributes, QuizAttemptCreationAttributes> implements QuizAttemptAttributes {
  declare id: string;
  declare userId: string;
  declare quizId: string;
  declare answers: Record<string, string>;
  declare score: number;
  declare passed: boolean;
  declare completedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

QuizAttempt.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
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
    answers: {
      type: DataTypes.JSONB,
      allowNull: false,
      comment: 'JSON object mapping question IDs to user answers',
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    passed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'quiz_attempts',
    timestamps: true,
    indexes: [
      {
        fields: ['userId', 'quizId'],
      },
      {
        fields: ['passed'],
      },
    ],
  }
);

export default QuizAttempt;
