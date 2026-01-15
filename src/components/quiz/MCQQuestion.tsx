'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MCQQuestionProps {
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
  userAnswer?: string;
  explanation?: string;
}

export default function MCQQuestion({ 
  question, 
  options, 
  onAnswer, 
  userAnswer,
  explanation 
}: MCQQuestionProps) {
  const handleSelect = (option: string) => {
    if (!userAnswer) {
      onAnswer(option);
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div>
          <p className="text-lg font-semibold text-gray-900 mb-6">{question}</p>
          
          <div className="space-y-3">
            {options.map((option, index) => {
              const isSelected = userAnswer === option;
              
              return (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  disabled={!!userAnswer}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                    ${userAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                      }
                    `}>
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={isSelected ? 'font-medium text-blue-900' : 'text-gray-700'}>
                      {option}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {userAnswer && explanation && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm font-semibold text-blue-900 mb-1">Explanation:</p>
            <p className="text-sm text-blue-800">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
