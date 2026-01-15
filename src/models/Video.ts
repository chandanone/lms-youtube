import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface VideoAttributes {
  id: string;
  chapterId: string;
  title: string;
  youtubeId: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'isFree'> {}

class Video extends Model<VideoAttributes, VideoCreationAttributes> implements VideoAttributes {
  declare id: string;
  declare chapterId: string;
  declare title: string;
  declare youtubeId: string;
  declare duration: number;
  declare order: number;
  declare isFree: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Video.init(
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
        len: [3, 255],
      },
    },
    youtubeId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: 'Duration in seconds',
      validate: {
        min: 0,
      },
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    isFree: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'Whether this video is part of the first 3 free videos',
    },
  },
  {
    sequelize,
    tableName: 'videos',
    timestamps: true,
    indexes: [
      {
        fields: ['chapterId', 'order'],
      },
      {
        fields: ['isFree'],
      },
    ],
  }
);

export default Video;
