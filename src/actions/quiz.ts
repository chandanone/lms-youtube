'use server';

import { revalidatePath } from 'next/cache';
import { Quiz, QuizQuestion, QuizAttempt, Chapter, Course } from '@/models';
import { auth } from '@/lib/auth';

export async function getQuizByChapterId(chapterId: string) {
  try {
    const quiz = await Quiz.findOne({
      where: { chapterId },
      include: [
        {
          model: QuizQuestion,
          as: 'questions',
          order: [['order', 'ASC']],
        },
      ],
    });

    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    return { success: true, quiz: quiz.toJSON() };
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return { success: false, error: 'Failed to fetch quiz' };
  }
}

export async function createQuiz(chapterId: string, data: { title: string; description?: string; passingScore?: number }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const chapter = await Chapter.findByPk(chapterId, {
      include: [{ model: Course, as: 'course' }],
    });

    if (!chapter) {
      return { success: false, error: 'Chapter not found' };
    }

    const course = chapter.get('course') as any;
    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const quiz = await Quiz.create({
      chapterId,
      ...data,
    });

    revalidatePath(`/admin/courses/${course.id}/edit`);
    return { success: true, quiz: quiz.toJSON() };
  } catch (error) {
    console.error('Error creating quiz:', error);
    return { success: false, error: 'Failed to create quiz' };
  }
}

export async function addQuizQuestion(
  quizId: string,
  data: {
    type: 'mcq' | 'flipcard';
    question: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    order: number;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Chapter,
          as: 'chapter',
          include: [{ model: Course, as: 'course' }],
        },
      ],
    });

    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    const chapter = quiz.get('chapter') as any;
    const course = chapter.get('course') as any;

    if (course.instructorId !== session.user.id && session.user.role !== 'admin') {
      return { success: false, error: 'Forbidden' };
    }

    const question = await QuizQuestion.create({
      quizId,
      ...data,
    });

    revalidatePath(`/admin/courses/${course.id}/edit`);
    return { success: true, question: question.toJSON() };
  } catch (error) {
    console.error('Error adding quiz question:', error);
    return { success: false, error: 'Failed to add question' };
  }
}

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: QuizQuestion,
          as: 'questions',
        },
      ],
    });

    if (!quiz) {
      return { success: false, error: 'Quiz not found' };
    }

    const questions = quiz.get('questions') as any[];
    let correctCount = 0;

    questions.forEach((question) => {
      const userAnswer = answers[question.id];
      if (userAnswer && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= quiz.passingScore;

    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      quizId,
      answers,
      score,
      passed,
      completedAt: new Date(),
    });

    return {
      success: true,
      attempt: attempt.toJSON(),
      result: {
        score,
        passed,
        correctCount,
        totalQuestions: questions.length,
      },
    };
  } catch (error) {
    console.error('Error submitting quiz attempt:', error);
    return { success: false, error: 'Failed to submit quiz' };
  }
}

export async function getUserQuizAttempts(quizId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const attempts = await QuizAttempt.findAll({
      where: {
        userId: session.user.id,
        quizId,
      },
      order: [['completedAt', 'DESC']],
    });

    return { success: true, attempts: attempts.map((a) => a.toJSON()) };
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return { success: false, error: 'Failed to fetch attempts' };
  }
}

export async function getQuizResults(attemptId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const attempt = await QuizAttempt.findByPk(attemptId, {
      include: [
        {
          model: Quiz,
          as: 'quiz',
          include: [
            {
              model: QuizQuestion,
              as: 'questions',
            },
          ],
        },
      ],
    });

    if (!attempt) {
      return { success: false, error: 'Attempt not found' };
    }

    if (attempt.userId !== session.user.id) {
      return { success: false, error: 'Forbidden' };
    }

    const quiz = attempt.get('quiz') as any;
    const questions = quiz.get('questions') as any[];

    const detailedResults = questions.map((question) => ({
      question: question.question,
      type: question.type,
      userAnswer: attempt.answers[question.id] || null,
      correctAnswer: question.correctAnswer,
      isCorrect:
        attempt.answers[question.id]?.toLowerCase().trim() ===
        question.correctAnswer.toLowerCase().trim(),
      explanation: question.explanation,
    }));

    return {
      success: true,
      results: {
        score: attempt.score,
        passed: attempt.passed,
        completedAt: attempt.completedAt,
        detailedResults,
      },
    };
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return { success: false, error: 'Failed to fetch results' };
  }
}
