import sequelize from "../src/lib/db.js";
// Executing this file registers all models and associations
import "../src/models/index.js";

async function runSync() {
  try {
    await sequelize.authenticate();
    console.log("📡 Connected to Neon.");

    // This confirms what Sequelize 'sees'
    const modelNames = Object.keys(sequelize.models);
    console.log("Attempting to sync models:", modelNames);

    if (modelNames.length === 0) {
      throw new Error("No models registered. Check your imports in index.ts!");
    }

    // alter: true is safe for development to add missing columns
    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Sync failed:", error);
    process.exit(1);
  }
}

runSync();
