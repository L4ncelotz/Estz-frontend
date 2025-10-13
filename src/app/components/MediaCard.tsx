'use client';

import { useState, useRef, Fragment } from 'react';
import Image from 'next/image';

// Icons for better UI feedback
const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white drop-shadow-lg">
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface Highlight {
  id: string;
  media_urls: string[];
  game: string | null;
  tags: string[] | null;
  username: string;
  created_at: string;
  content: string | null;
}

interface MediaCardProps {
  highlight: Highlight;
}

export default function MediaCard({ highlight }: MediaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawMedia = highlight?.media_urls;
  const mediaUrl = Array.isArray(rawMedia) && rawMedia.length > 0 ? rawMedia[0] : null;

  const hasValidMedia = typeof mediaUrl === "string" && mediaUrl.trim() !== "";
  const isVideo = hasValidMedia && (mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".mov") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".mkv"));
  const isImage = hasValidMedia && (mediaUrl.endsWith(".png") || mediaUrl.endsWith(".jpg") || mediaUrl.endsWith(".jpeg") || mediaUrl.endsWith(".gif") || mediaUrl.includes("cdn.discordapp.com"));

  const formattedDate = highlight?.created_at
    ? new Date(highlight.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "Unknown";

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().catch(error => console.error("Video play failed:", error));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  return (
    <Fragment>
      <div 
        className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-md overflow-hidden border border-blue-200/60 group 
                   transition-all duration-300 ease-out cursor-pointer
                   hover:shadow-lg hover:shadow-blue-300/30 hover:scale-[1.03] hover:-translate-y-1 hover:border-blue-400"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={toggleModal}
      >
        {/* Media Area */}
        <div className="relative w-full h-44 bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800 flex items-center justify-center overflow-hidden">
          {hasValidMedia ? (
            isVideo ? (
              <>
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  preload="metadata"
                  muted
                  loop
                  playsInline
                />
                <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/40 to-indigo-900/40 transition-opacity duration-300
                                ${isHovered && !videoRef.current?.paused ? 'opacity-0' : 'opacity-100'}`}>
                  <PlayIcon />
                </div>
              </>
            ) : (
              <Image
                src={mediaUrl}
                alt={`Highlight from ${highlight.game || "Unknown Game"}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            )
          ) : (
            <div className="text-blue-300 text-xs font-medium">No media</div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex flex-col flex-grow h-36 bg-gradient-to-b from-white to-blue-50/20">
          <div className="flex-grow">
              {highlight.game && (
                  <p className="font-bold text-base text-blue-900 truncate group-hover:text-blue-600 transition-colors duration-300" title={highlight.game}>
                      {highlight.game}
                  </p>
              )}
              {highlight.content && (
                  <p className="text-blue-700 text-xs mt-1 line-clamp-2 leading-relaxed" title={highlight.content}>
                      {highlight.content}
                  </p>
              )}
               {highlight.tags && highlight.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                      {highlight.tags.map((tag, index) => (
                      <span
                          key={index}
                          className="bg-gradient-to-r from-blue-100 to-sky-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-300 transition-all duration-300 hover:border-blue-500 hover:shadow-sm cursor-pointer"
                      >
                          #{tag}
                      </span>
                      ))}
                  </div>
              )}
          </div>

          {/* Footer Area */}
          <div className="mt-2 pt-2 border-t border-blue-100 flex justify-between items-center text-xs">
            <span className="font-semibold text-blue-900 truncate">By {highlight.username}</span>
            <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full">{formattedDate}</span>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000 pointer-events-none"></div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-gradient-to-br from-blue-950/95 via-indigo-950/95 to-blue-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={toggleModal}
        >
          <button 
            className="absolute top-4 right-4 text-white bg-blue-600/30 hover:bg-blue-600/50 backdrop-blur-sm p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 z-50 shadow-lg cursor-pointer"
            onClick={toggleModal}
          >
            <CloseIcon />
          </button>
          
          <div className="relative w-full max-w-5xl max-h-[90vh] rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {isVideo && mediaUrl ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-contain bg-gradient-to-br from-blue-900 to-indigo-900"
                controls
                autoPlay
                loop
                playsInline
              />
            ) : isImage && mediaUrl ? (
                <div className="relative w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900">
                  <Image
                    src={mediaUrl}
                    alt={`Highlight from ${highlight.game || "Unknown Game"}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </div>
            ) : null}
          </div>
        </div>
      )}
    </Fragment>
  );
}