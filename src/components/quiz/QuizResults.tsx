'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trophy, RotateCcw } from 'lucide-react';

interface QuizResultsProps {
  results: {
    score: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
  };
  quiz: any;
  answers: Record<string, string>;
  onRetry: () => void;
  onContinue: () => void;
}

export default function QuizResults({ 
  results, 
  quiz, 
  answers, 
  onRetry, 
  onContinue 
}: QuizResultsProps) {
  return (
    <div className="space-y-6">
      <Card className={results.passed ? 'border-green-500 border-2' : 'border-red-500 border-2'}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {results.passed ? (
              <Trophy className="w-16 h-16 text-yellow-500" />
            ) : (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-3xl">
            {results.passed ? 'Congratulations!' : 'Keep Learning!'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-5xl font-bold mb-2">
              {results.score}%
            </p>
            <p className="text-gray-600">
              {results.correctCount} out of {results.totalQuestions} questions correct
            </p>
            {!results.passed && (
              <p className="text-red-600 mt-2">
                Passing score: {quiz.passingScore}%
              </p>
            )}
          </div>

          <div className="space-y-3">
            {quiz.questions.map((question: any, index: number) => {
              const userAnswer = answers[question.id];
              const isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

              return (
                <div 
                  key={question.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-1" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-1">
                        Question {index + 1}: {question.question}
                      </p>
                      <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                        Your answer: {userAnswer || 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-600 mt-1">
                          Correct answer: {question.correctAnswer}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {!results.passed && (
              <Button onClick={onRetry} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Retry Quiz
              </Button>
            )}
            <Button onClick={onContinue} className="flex-1">
              Continue Learning
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
