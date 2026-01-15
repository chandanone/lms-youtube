import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface CertificateAttributes {
  id: string;
  userId: string;
  enrollmentId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CertificateCreationAttributes extends Optional<CertificateAttributes, 'id' | 'pdfUrl'> {}

class Certificate extends Model<CertificateAttributes, CertificateCreationAttributes> implements CertificateAttributes {
  declare id: string;
  declare userId: string;
  declare enrollmentId: string;
  declare courseId: string;
  declare certificateNumber: string;
  declare issuedAt: Date;
  declare pdfUrl: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Certificate.init(
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
    enrollmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'enrollments',
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
    certificateNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: 'Unique certificate identifier',
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    pdfUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'URL to the generated PDF certificate',
    },
  },
  {
    sequelize,
    tableName: 'certificates',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'courseId'],
      },
      {
        unique: true,
        fields: ['certificateNumber'],
      },
    ],
  }
);

export default Certificate;
