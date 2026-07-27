"use client";

import React from "react";
import { Clock, Tag, AlignLeft } from "lucide-react";

interface TimelineEvent {
  timestamp: string;
  description: string;
  objects_detected: string[];
  ocr_text?: string;
}

interface VideoTimelineProps {
  timeline: TimelineEvent[];
}

export function VideoTimeline({ timeline }: VideoTimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold border-b pb-2">Video Timeline</h3>
      <div className="relative border-l-2 border-blue-200 ml-4 space-y-8">
        {timeline.map((event, index) => (
          <div key={index} className="relative pl-6">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="font-semibold text-blue-600">{event.timestamp}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
              <p className="text-gray-800 font-medium mb-3">{event.description}</p>
              
              {event.objects_detected && event.objects_detected.length > 0 && (
                <div className="flex items-start space-x-2 mt-2">
                  <Tag className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex flex-wrap gap-2">
                    {event.objects_detected.map((obj, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {obj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {event.ocr_text && (
                <div className="flex items-start space-x-2 mt-3 text-sm">
                  <AlignLeft className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 italic">"{event.ocr_text}"</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
