"use client";

import React, { useRef, useEffect, useState } from "react";

interface PersonTrack {
  box_2d: number[]; // [ymin, xmin, ymax, xmax] scaled 0-1000
  clothing: string;
  action: string;
}

interface TrackingData {
  timestamp_seconds: number;
  people: PersonTrack[];
}

interface VideoPlayerOverlayProps {
  videoUrl: string;
  trackingData: TrackingData[];
}

export function VideoPlayerOverlay({ videoUrl, trackingData }: VideoPlayerOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const renderOverlay = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Sync canvas size with video size
      if (canvas.width !== video.clientWidth || canvas.height !== video.clientHeight) {
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Find the tracking data that matches the current video time
      // Since tracking data is likely discrete seconds, we find the closest one
      const currentTime = video.currentTime;
      const currentTrack = trackingData.find((data) => {
        // Match within a 1-second window
        return Math.abs(data.timestamp_seconds - currentTime) < 0.5;
      });

      if (currentTrack) {
        currentTrack.people.forEach((person) => {
          const [ymin, xmin, ymax, xmax] = person.box_2d;

          // Convert 0-1000 scale to canvas coordinates
          const x = (xmin / 1000) * canvas.width;
          const y = (ymin / 1000) * canvas.height;
          const w = ((xmax - xmin) / 1000) * canvas.width;
          const h = ((ymax - ymin) / 1000) * canvas.height;

          // Draw Bounding Box
          ctx.strokeStyle = "#3b82f6"; // blue-500
          ctx.lineWidth = 3;
          ctx.strokeRect(x, y, w, h);

          // Draw Label Background
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          const text = `${person.clothing} | ${person.action}`;
          const textWidth = ctx.measureText(text).width;
          ctx.fillRect(x, y > 24 ? y - 24 : y, textWidth + 8, 24);

          // Draw Text
          ctx.fillStyle = "#ffffff";
          ctx.font = "12px sans-serif";
          ctx.fillText(text, x + 4, y > 24 ? y - 8 : y + 16);
        });
      }

      // Draw Person Counter
      const count = currentTrack ? currentTrack.people.length : 0;
      const countText = `People Detected: ${count}`;
      ctx.font = "bold 14px sans-serif";
      const countTextWidth = ctx.measureText(countText).width;
      
      // Counter Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.roundRect 
        ? ctx.roundRect(canvas.width - countTextWidth - 24, 12, countTextWidth + 16, 28, 6)
        : ctx.fillRect(canvas.width - countTextWidth - 24, 12, countTextWidth + 16, 28);
      ctx.fill();

      // Counter Text
      ctx.fillStyle = count > 0 ? "#4ade80" : "#9ca3af"; // green if > 0, gray if 0
      ctx.fillText(countText, canvas.width - countTextWidth - 16, 31);

      animationFrameId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [trackingData]);

  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-auto max-h-[600px]"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
      {!isPlaying && trackingData.length > 0 && (
        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
          AI Tracking Enabled
        </div>
      )}
    </div>
  );
}
