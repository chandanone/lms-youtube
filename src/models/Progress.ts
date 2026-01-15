import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface ProgressAttributes {
  id: string;
  userId: string;
  videoId: string;
  courseId: string;
  completed: boolean;
  watchTime: number;
  lastWatchedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgressCreationAttributes extends Optional<ProgressAttributes, 'id' | 'completed' | 'watchTime'> {}

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  declare id: string;
  declare userId: string;
  declare videoId: string;
  declare courseId: string;
  declare completed: boolean;
  declare watchTime: number;
  declare lastWatchedAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Progress.init(
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
    videoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'videos',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    watchTime: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      comment: 'Watch time in seconds',
      validate: {
        min: 0,
      },
    },
    lastWatchedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'progress',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'videoId'],
      },
      {
        fields: ['userId', 'courseId'],
      },
      {
        fields: ['completed'],
      },
    ],
  }
);

export default Progress;
