import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface EnrollmentAttributes {
  id: string;
  userId: string;
  courseId: string;
  status: 'active' | 'completed' | 'cancelled';
  enrolledAt: Date;
  completedAt: Date | null;
  paymentId: string | null;
  amountPaid: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EnrollmentCreationAttributes extends Optional<EnrollmentAttributes, 'id' | 'status' | 'completedAt' | 'paymentId'> {}

class Enrollment extends Model<EnrollmentAttributes, EnrollmentCreationAttributes> implements EnrollmentAttributes {
  declare id: string;
  declare userId: string;
  declare courseId: string;
  declare status: 'active' | 'completed' | 'cancelled';
  declare enrolledAt: Date;
  declare completedAt: Date | null;
  declare paymentId: string | null;
  declare amountPaid: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Enrollment.init(
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
    status: {
      type: DataTypes.ENUM('active', 'completed', 'cancelled'),
      defaultValue: 'active',
      allowNull: false,
    },
    enrolledAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Razorpay payment ID',
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: 'enrollments',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId'],
      },
      {
        fields: ['status'],
      },
    ],
  }
);

export default Enrollment;
