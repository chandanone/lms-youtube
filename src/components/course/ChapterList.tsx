'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle, PlayCircle } from 'lucide-react';

interface ChapterListProps {
  chapters: any[];
  currentVideoId: string;
  courseId: string;
  isEnrolled: boolean;
  freeVideosCount: number;
}

export default function ChapterList({ 
  chapters, 
  currentVideoId, 
  courseId, 
  isEnrolled,
  freeVideosCount 
}: ChapterListProps) {
  let videoIndex = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {chapters.map((chapter: any) => (
          <div key={chapter.id} className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-700">{chapter.title}</h3>
            
            {chapter.videos?.map((video: any) => {
              const isFree = videoIndex < freeVideosCount;
              const canAccess = isEnrolled || isFree;
              const isCurrent = video.id === currentVideoId;
              videoIndex++;

              return (
                <a
                  key={video.id}
                  href={canAccess ? `/courses/${courseId}/learn?v=${video.id}` : '#'}
                  className={`
                    flex items-center justify-between p-3 rounded-md transition
                    ${isCurrent 
                      ? 'bg-blue-50 border-2 border-blue-500' 
                      : canAccess 
                        ? 'bg-gray-50 hover:bg-gray-100' 
                        : 'bg-gray-50 opacity-60 cursor-not-allowed'
                    }
                  `}
                  onClick={(e) => {
                    if (!canAccess) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {isCurrent ? (
                      <PlayCircle className="w-5 h-5 text-blue-600" />
                    ) : canAccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    
                    <span className={`text-sm ${isCurrent ? 'font-semibold text-blue-900' : 'text-gray-700'}`}>
                      {video.title}
                    </span>
                  </div>
                  
                  {isFree && !isEnrolled && (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </a>
              );
            })}
            
            {chapter.quiz && isEnrolled && (
              <a
                href={`/courses/${courseId}/learn?quiz=true`}
                className="flex items-center justify-between p-3 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                    ?
                  </div>
                  <span className="text-sm font-medium text-purple-900">Knowledge Check</span>
                </div>
                <Badge className="bg-purple-600">Quiz</Badge>
              </a>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
