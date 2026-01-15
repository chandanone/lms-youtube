'use client';

import { useState, useEffect } from 'react';
import { getQuizByChapterId, submitQuizAttempt } from '@/actions/quiz';
import FlipCard from './FlipCard';
import MCQQuestion from './MCQQuestion';
import QuizResults from './QuizResults';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuizContainerProps {
  chapterId: string;
  courseId: string;
  onComplete: () => void;
}

export default function QuizContainer({ chapterId, courseId, onComplete }: QuizContainerProps) {
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    loadQuiz();
  }, [chapterId]);

  const loadQuiz = async () => {
    setLoading(true);
    const result = await getQuizByChapterId(chapterId);
    if (result.success && result.quiz) {
      setQuiz(result.quiz);
    }
    setLoading(false);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const result = await submitQuizAttempt(quiz.id, answers);
    if (result.success) {
      setResults(result.result);
      setShowResults(true);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">No quiz available for this chapter.</p>
          <Button onClick={onComplete} className="mt-4">Continue Learning</Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults && results) {
    return (
      <QuizResults 
        results={results}
        quiz={quiz}
        answers={answers}
        onRetry={() => {
          setAnswers({});
          setCurrentQuestionIndex(0);
          setShowResults(false);
          setResults(null);
        }}
        onContinue={onComplete}
      />
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const allQuestionsAnswered = quiz.questions.every((q: any) => answers[q.id]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          {quiz.description && <p className="text-gray-600 text-sm">{quiz.description}</p>}
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
              <span>Passing Score: {quiz.passingScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {currentQuestion.type === 'flipcard' ? (
            <FlipCard 
              question={currentQuestion.question}
              answer={currentQuestion.correctAnswer}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              userAnswer={answers[currentQuestion.id]}
            />
          ) : (
            <MCQQuestion 
              question={currentQuestion.question}
              options={currentQuestion.options || []}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              userAnswer={answers[currentQuestion.id]}
              explanation={currentQuestion.explanation}
            />
          )}

          <div className="flex justify-between mt-6">
            <Button 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={!allQuestionsAnswered}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
