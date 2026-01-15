'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface FlipCardProps {
  question: string;
  answer: string;
  onAnswer: (answer: string) => void;
  userAnswer?: string;
}

export default function FlipCard({ question, answer, onAnswer, userAnswer }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped && !userAnswer) {
      onAnswer(answer);
    }
  };

  return (
    <div className="space-y-4">
      <div className="perspective-1000">
        <div 
          className={`relative w-full h-64 transition-transform duration-500 transform-style-3d cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={handleFlip}
        >
          <Card className="absolute w-full h-full backface-hidden">
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">Click to reveal answer</p>
                <p className="text-2xl font-semibold text-gray-900">{question}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="absolute w-full h-full backface-hidden rotate-y-180 bg-blue-50">
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <p className="text-sm text-blue-600 mb-4">Answer</p>
                <p className="text-2xl font-semibold text-blue-900">{answer}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button 
        onClick={handleFlip}
        variant="outline"
        className="w-full"
      >
        {isFlipped ? 'Show Question' : 'Reveal Answer'}
      </Button>

      {userAnswer && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">✓ Card reviewed</p>
        </div>
      )}

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
