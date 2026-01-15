import sequelize, { testConnection } from "../src/lib/db";
import "../src/models"; // Import models to register associations

async function initDatabase() {
  console.log("🔄 Initializing database...\n");

  try {
    // Test connection
    const connected = await testConnection();

    if (!connected) {
      console.error("❌ Failed to connect to database");
      process.exit(1);
    }

    // Create tables (force: true will drop existing tables)
    console.log("📋 Creating database tables...");
    await sequelize.sync({ force: true });

    console.log("\n✅ Database initialized successfully!");
    console.log("\n📋 Tables created:");
    console.log("   - users");
    console.log("   - courses");
    console.log("   - chapters");
    console.log("   - videos");
    console.log("   - enrollments");
    console.log("   - progress");
    console.log("   - quizzes");
    console.log("   - quiz_questions");
    console.log("   - quiz_attempts");
    console.log("   - testimonials");
    console.log("   - certificates");

    console.log("\n💡 Next steps:");
    console.log("   1. Run: npm run db:seed (optional - adds sample data)");
    console.log("   2. Run: npm run dev");
    console.log("   3. Visit: http://localhost:3000");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initDatabase();
