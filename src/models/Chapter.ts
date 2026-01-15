import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface ChapterAttributes {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChapterCreationAttributes extends Optional<ChapterAttributes, 'id' | 'description'> {}

class Chapter extends Model<ChapterAttributes, ChapterCreationAttributes> implements ChapterAttributes {
  declare id: string;
  declare courseId: string;
  declare title: string;
  declare description: string | null;
  declare order: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Chapter.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'chapters',
    timestamps: true,
    indexes: [
      {
        fields: ['courseId', 'order'],
      },
    ],
  }
);

export default Chapter;
