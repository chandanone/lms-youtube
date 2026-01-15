import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  currency: string;
  instructorId: string;
  published: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'thumbnail' | 'published'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  declare id: string;
  declare title: string;
  declare description: string;
  declare thumbnail: string | null;
  declare price: number;
  declare currency: string;
  declare instructorId: string;
  declare published: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    thumbnail: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'INR',
      allowNull: false,
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true,
    indexes: [
      {
        fields: ['instructorId'],
      },
      {
        fields: ['published'],
      },
    ],
  }
);

export default Course;
