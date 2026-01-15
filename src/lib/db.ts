import "pg";
import { Sequelize } from "sequelize";

/**
 * Prevent multiple Sequelize instances in Next.js (hot reload / dev mode)
 */
const globalForSequelize = globalThis as unknown as {
  sequelize?: Sequelize;
};

/**
 * Create or reuse Sequelize instance
 */
const sequelize =
  globalForSequelize.sequelize ??
  new Sequelize(process.env.DATABASE_URL!, {
    dialect: "postgres",

    // Logging only in development
    logging: process.env.NODE_ENV === "development" ? console.log : false,

    // Connection pool (important for Neon)
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    // Neon ALWAYS requires SSL
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });

/**
 * Save instance globally in dev to avoid connection leaks
 */
if (process.env.NODE_ENV !== "production") {
  globalForSequelize.sequelize = sequelize;
}

/**
 * Test DB connection
 */
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    return true;
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    return false;
  }
};

/**
 * Sync database (use ONLY during development)
 */
export const syncDatabase = async (options?: {
  force?: boolean;
  alter?: boolean;
}) => {
  try {
    await sequelize.sync(options);
    console.log("✅ Database synchronized successfully.");
  } catch (error) {
    console.error("❌ Database synchronization failed:", error);
    throw error;
  }
};

export default sequelize;
