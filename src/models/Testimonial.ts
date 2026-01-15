import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface TestimonialAttributes {
  id: string;
  userId: string;
  courseId: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TestimonialCreationAttributes extends Optional<TestimonialAttributes, 'id' | 'approved'> {}

class Testimonial extends Model<TestimonialAttributes, TestimonialCreationAttributes> implements TestimonialAttributes {
  declare id: string;
  declare userId: string;
  declare courseId: string;
  declare rating: number;
  declare comment: string;
  declare approved: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Testimonial.init(
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
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 1000],
      },
    },
    approved: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Admin approval for displaying testimonial',
    },
  },
  {
    sequelize,
    tableName: 'testimonials',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId'],
      },
      {
        fields: ['courseId', 'approved'],
      },
      {
        fields: ['rating'],
      },
    ],
  }
);

export default Testimonial;
