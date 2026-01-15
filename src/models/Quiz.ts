import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface QuizAttributes {
  id: string;
  chapterId: string;
  title: string;
  description: string | null;
  passingScore: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface QuizCreationAttributes extends Optional<QuizAttributes, 'id' | 'description' | 'passingScore'> {}

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  declare id: string;
  declare chapterId: string;
  declare title: string;
  declare description: string | null;
  declare passingScore: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Quiz.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    chapterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'chapters',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    passingScore: {
      type: DataTypes.INTEGER,
      defaultValue: 70,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
  },
  {
    sequelize,
    tableName: 'quizzes',
    timestamps: true,
    indexes: [
      {
        fields: ['chapterId'],
      },
    ],
  }
);

export default Quiz;
