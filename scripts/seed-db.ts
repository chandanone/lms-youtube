import sequelize from "../src/lib/db";
import {
  User,
  Course,
  Chapter,
  Video,
  Quiz,
  QuizQuestion,
} from "../src/models";

async function seedDatabase() {
  console.log("🌱 Seeding database with sample data...\n");

  try {
    // Sync database first
    console.log("📋 Syncing database schema...");
    await sequelize.sync({ force: true });
    console.log("✓ Database synced\n");

    // Create instructor user
    console.log("Creating sample instructor...");
    const instructor = await User.create({
      name: "John Doe",
      email: "instructor@example.com",
      role: "instructor",
      emailVerified: new Date(),
      image:
        "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff",
    });
    console.log("✓ Instructor created\n");

    // Create course
    console.log("Creating sample course...");
    const course = await Course.create({
      title: "Complete Web Development Bootcamp 2025",
      description:
        "Learn HTML, CSS, JavaScript, React, Node.js, and PostgreSQL from scratch. Build real-world projects and get job-ready skills.",
      price: 2999,
      currency: "INR",
      instructorId: instructor.id,
      published: true,
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    });
    console.log("✓ Course created\n");

    // Chapter 1: Introduction
    console.log("Creating Chapter 1: Introduction...");
    const chapter1 = await Chapter.create({
      courseId: course.id,
      title: "Introduction to Web Development",
      description: "Get started with the fundamentals of web development",
      order: 0,
    });

    // First 3 videos (FREE)
    await Video.bulkCreate([
      {
        chapterId: chapter1.id,
        title: "Welcome to the Course",
        youtubeId: "dQw4w9WgXcQ",
        duration: 300,
        order: 0,
        isFree: true,
      },
      {
        chapterId: chapter1.id,
        title: "Setting Up Your Development Environment",
        youtubeId: "dQw4w9WgXcQ",
        duration: 600,
        order: 1,
        isFree: true,
      },
      {
        chapterId: chapter1.id,
        title: "Your First HTML Page",
        youtubeId: "dQw4w9WgXcQ",
        duration: 900,
        order: 2,
        isFree: true,
      },
    ]);
    console.log("✓ Chapter 1 created with 3 FREE videos\n");

    // Chapter 2: HTML Deep Dive
    console.log("Creating Chapter 2: HTML...");
    const chapter2 = await Chapter.create({
      courseId: course.id,
      title: "HTML Deep Dive",
      description: "Master HTML fundamentals and semantic markup",
      order: 1,
    });

    // Locked videos (require enrollment)
    await Video.bulkCreate([
      {
        chapterId: chapter2.id,
        title: "HTML Tags and Elements",
        youtubeId: "dQw4w9WgXcQ",
        duration: 1200,
        order: 0,
        isFree: false,
      },
      {
        chapterId: chapter2.id,
        title: "HTML Forms and Input Types",
        youtubeId: "dQw4w9WgXcQ",
        duration: 1500,
        order: 1,
        isFree: false,
      },
      {
        chapterId: chapter2.id,
        title: "Semantic HTML and Accessibility",
        youtubeId: "dQw4w9WgXcQ",
        duration: 1800,
        order: 2,
        isFree: false,
      },
    ]);
    console.log("✓ Chapter 2 created with 3 LOCKED videos\n");

    // Chapter 3: CSS Fundamentals
    console.log("Creating Chapter 3: CSS...");
    const chapter3 = await Chapter.create({
      courseId: course.id,
      title: "CSS Fundamentals",
      description: "Learn CSS styling, layouts, and responsive design",
      order: 2,
    });

    await Video.bulkCreate([
      {
        chapterId: chapter3.id,
        title: "CSS Selectors and Properties",
        youtubeId: "dQw4w9WgXcQ",
        duration: 1400,
        order: 0,
        isFree: false,
      },
      {
        chapterId: chapter3.id,
        title: "Flexbox Layout",
        youtubeId: "dQw4w9WgXcQ",
        duration: 1600,
        order: 1,
        isFree: false,
      },
    ]);
    console.log("✓ Chapter 3 created with 2 LOCKED videos\n");

    // Create quiz for Chapter 1
    console.log("Creating quiz for Chapter 1...");
    const quiz1 = await Quiz.create({
      chapterId: chapter1.id,
      title: "Introduction Knowledge Check",
      description: "Test your understanding of web development basics",
      passingScore: 70,
    });

    await QuizQuestion.bulkCreate([
      {
        quizId: quiz1.id,
        type: "flipcard",
        question: "What does HTML stand for?",
        correctAnswer: "HyperText Markup Language",
        explanation:
          "HTML is the standard markup language for creating web pages.",
        order: 0,
      },
      {
        quizId: quiz1.id,
        type: "flipcard",
        question: "What does CSS stand for?",
        correctAnswer: "Cascading Style Sheets",
        explanation: "CSS is used to style and layout web pages.",
        order: 1,
      },
      {
        quizId: quiz1.id,
        type: "mcq",
        question: "Which tag is used for the largest heading in HTML?",
        options: ["<h1>", "<h6>", "<heading>", "<head>"],
        correctAnswer: "<h1>",
        explanation:
          "The <h1> tag is used for the largest heading, while <h6> is the smallest.",
        order: 2,
      },
      {
        quizId: quiz1.id,
        type: "mcq",
        question:
          "What is the correct HTML element for inserting a line break?",
        options: ["<break>", "<br>", "<lb>", "<linebreak>"],
        correctAnswer: "<br>",
        explanation:
          "The <br> tag is a self-closing tag that creates a line break.",
        order: 3,
      },
      {
        quizId: quiz1.id,
        type: "mcq",
        question:
          "Which HTML attribute specifies an alternate text for an image?",
        options: ["alt", "title", "src", "text"],
        correctAnswer: "alt",
        explanation:
          "The alt attribute provides alternative text for screen readers and when images fail to load.",
        order: 4,
      },
    ]);
    console.log("✓ Quiz created with 2 flip cards and 3 MCQs\n");

    // Create quiz for Chapter 2
    console.log("Creating quiz for Chapter 2...");
    const quiz2 = await Quiz.create({
      chapterId: chapter2.id,
      title: "HTML Mastery Quiz",
      description: "Test your HTML knowledge",
      passingScore: 75,
    });

    await QuizQuestion.bulkCreate([
      {
        quizId: quiz2.id,
        type: "flipcard",
        question: "What is semantic HTML?",
        correctAnswer:
          "HTML that clearly describes its meaning to both the browser and the developer",
        explanation:
          "Semantic elements like <article>, <nav>, <header> clearly describe their purpose.",
        order: 0,
      },
      {
        quizId: quiz2.id,
        type: "mcq",
        question: "Which HTML5 element is used for independent content?",
        options: ["<section>", "<article>", "<div>", "<content>"],
        correctAnswer: "<article>",
        explanation:
          "The <article> element represents independent, self-contained content.",
        order: 1,
      },
    ]);
    console.log("✓ Quiz created for Chapter 2\n");

    console.log("✅ Database seeded successfully!\n");
    console.log("📊 Summary:");
    console.log("   ✓ 1 Instructor user");
    console.log('   ✓ 1 Course: "Complete Web Development Bootcamp 2025"');
    console.log("   ✓ 3 Chapters");
    console.log("   ✓ 8 Videos (first 3 are FREE)");
    console.log("   ✓ 2 Quizzes with 7 questions total");
    console.log("\n💡 Next steps:");
    console.log("   1. Run: npm run dev");
    console.log("   2. Visit: http://localhost:3000");
    console.log("   3. Sign in with Google");
    console.log("   4. Browse the sample course!");
    console.log("\n🔐 Test Razorpay Card: 4111 1111 1111 1111");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

seedDatabase();
