"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, CheckCircle, AlertCircle, FileText, Image as ImageIcon, Users, MessageSquare } from "lucide-react";
import { VideoTimeline } from "./VideoTimeline";
import { VideoPlayerOverlay } from "./VideoPlayerOverlay";
import { createClient } from "@/utils/supabase/client";

export function AnalysisResults({ uploadId }: { uploadId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchResults = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/analysis/${uploadId}`);
        const job = response.data;
        
        if (job.status === "completed" || job.status === "failed") {
          setData(job);
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err: any) {
        // Only set error if it's not a 404 (might just be pending insert)
        if (err.response?.status !== 404) {
          setError(err.response?.data?.detail || err.message);
          setLoading(false);
          clearInterval(interval);
        }
      }
    };

    fetchResults(); // Initial fetch
    interval = setInterval(fetchResults, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [uploadId]);

  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700 flex items-center">
        <AlertCircle className="w-6 h-6 mr-3" />
        <div>
          <h3 className="font-semibold">Error fetching results</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-sm border text-center flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Analyzing Media...</h3>
        <p className="text-sm text-gray-500 mt-2">Groq Vision AI is processing your upload. This usually takes 5-10 seconds.</p>
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-red-700 flex items-center">
        <AlertCircle className="w-6 h-6 mr-3" />
        <div>
          <h3 className="font-semibold">Analysis Failed</h3>
          <p className="text-sm">{data.results?.error || "Unknown error during processing."}</p>
        </div>
      </div>
    );
  }

  const res = data.results || {};

  const handleStartChat = async () => {
    try {
      setCreatingChat(true);
      
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/chat/sessions`, {
        user_id: "00000000-0000-0000-0000-000000000000", // dummy id for unauthenticated users
        upload_id: uploadId
      });
      router.push(`/chat/${response.data.id}`);
    } catch (err) {
      console.error("Failed to create chat", err);
      setCreatingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            Analysis Complete
            <CheckCircle className="w-6 h-6 text-green-500 ml-2" />
          </h2>
          <p className="text-sm text-gray-500 mt-1">Job ID: {data.id}</p>
        </div>
        <button 
          onClick={handleStartChat}
          disabled={creatingChat}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {creatingChat ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MessageSquare className="w-4 h-4 mr-2" />}
          Chat about Image
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Scene Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4 text-blue-600">
            <ImageIcon className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Scene Summary</h3>
          </div>
          <p className="text-gray-700 text-sm">{res.scene_summary || "No summary available."}</p>
        </div>

        {/* OCR Text */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4 text-indigo-600">
            <FileText className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Extracted Text (OCR)</h3>
          </div>
          <div className="bg-gray-50 p-3 rounded border text-sm text-gray-700 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap">
            {res.ocr_text || "No text detected in the image."}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Detected Objects */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Detected Objects</h3>
          {res.objects && res.objects.length > 0 ? (
            <ul className="space-y-3">
              {res.objects.map((obj: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center text-sm border-b pb-2">
                  <span className="font-medium text-gray-800">{obj.label}</span>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${obj.confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {obj.confidence} conf
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{obj.bounding_box_approximate}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No objects detected.</p>
          )}
        </div>

        {/* Person Attributes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4 text-pink-600">
            <Users className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">People Estimates</h3>
          </div>
          {res.people && res.people.length > 0 ? (
            <div className="space-y-4">
              {res.people.map((person: any, idx: number) => (
                <div key={idx} className="bg-pink-50 rounded p-3 text-sm">
                  <p className="font-medium text-gray-900 mb-1">{person.description}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div><span className="text-gray-500">Position:</span> {person.position}</div>
                    <div><span className="text-gray-500">Count:</span> {person.count_approximate}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No people detected.</p>
          )}
        </div>
      </div>
      
      {/* Video Tracking Overlay (Only shows if tracking data and file_url exist) */}
      {res.tracking_data && data.file_url && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Spatial Video Tracking</h3>
          <VideoPlayerOverlay videoUrl={data.file_url} trackingData={res.tracking_data} />
        </div>
      )}
      
      {/* Video Timeline (Only shows if timeline data exists) */}
      {res.timeline && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
          <VideoTimeline timeline={res.timeline} />
        </div>
      )}
    </div>
  );
}
