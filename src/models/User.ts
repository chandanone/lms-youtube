import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface UserAttributes {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: 'student' | 'instructor' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'name' | 'emailVerified' | 'image' | 'role'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare name: string | null;
  declare email: string;
  declare emailVerified: Date | null;
  declare image: string | null;
  declare role: 'student' | 'instructor' | 'admin';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    emailVerified: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('student', 'instructor', 'admin'),
      defaultValue: 'student',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

export default User;
