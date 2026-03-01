import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
  onEnded?: () => void;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title,
  onEnded,
  autoplay = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
        <h3 className="text-xl font-bold text-white text-center">{title}</h3>
      </div>
      
      <div className="relative aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playing={autoplay}
          onEnded={onEnded}
          config={{
            youtube: {
              playerVars: {
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
