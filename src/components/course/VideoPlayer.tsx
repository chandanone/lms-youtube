'use client';

import { useEffect, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import { updateProgress } from '@/actions/progress';

interface VideoPlayerProps {
  video: any;
  courseId: string;
  isEnrolled: boolean;
}

export default function VideoPlayer({ video, courseId, isEnrolled }: VideoPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (player && !isCompleted) {
      interval = setInterval(async () => {
        try {
          const currentTime = await player.getCurrentTime();
          const duration = await player.getDuration();
          
          setWatchTime(Math.floor(currentTime));

          if (currentTime / duration >= 0.9 && !isCompleted) {
            setIsCompleted(true);
            await updateProgress(video.id, { completed: true, watchTime: Math.floor(currentTime) });
          } else if (Math.floor(currentTime) % 10 === 0) {
            await updateProgress(video.id, { watchTime: Math.floor(currentTime) });
          }
        } catch (error) {
          console.error('Error tracking progress:', error);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [player, video.id, isCompleted]);

  const onReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
  };

  const onEnd: YouTubeProps['onEnd'] = async () => {
    if (!isCompleted) {
      setIsCompleted(true);
      await updateProgress(video.id, { completed: true, watchTime: video.duration });
    }
  };

  const opts: YouTubeProps['opts'] = {
    width: '100%',
    height: '500',
    playerVars: {
      autoplay: 0,
      modestbranding: 1,
      rel: 0,
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <YouTube 
        videoId={video.youtubeId} 
        opts={opts} 
        onReady={onReady}
        onEnd={onEnd}
        className="w-full aspect-video"
      />
    </div>
  );
}
