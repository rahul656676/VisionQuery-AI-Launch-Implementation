"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";

export function UploadDropzone() {
  const router = useRouter();
  const supabase = createClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("idle");
    setUploadProgress(0);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/uploads/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Bypass-Tunnel-Reminder": "true",
          "ngrok-skip-browser-warning": "true",
          ...(token ? { "Authorization": `Bearer ${token}` } : {})
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1));
          setUploadProgress(percentCompleted);
        },
      });

      console.log("Upload Success:", response.data);
      setUploadStatus("success");
      toast.success("Upload successful!");
      
      // Redirect to the analysis page if the job is created
      const uploadId = response.data?.upload?.id || response.data?.job?.upload_id;
      if (uploadId && uploadId !== "undefined") {
        setTimeout(() => {
          router.push(`/upload/${uploadId}`);
        }, 1500);
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      setUploadStatus("error");
      const msg = error.response?.data?.detail || error.message || "An error occurred during upload.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  }, [router, supabase]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "video/mp4": [],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white hover:bg-gray-50"}
          ${isDragReject ? "border-red-500 bg-red-50" : ""}
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-900">Uploading...</p>
            <div className="w-full max-w-xs mt-4 bg-gray-200 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          </div>
        ) : uploadStatus === "success" ? (
          <div className="flex flex-col items-center text-green-600">
            <CheckCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Upload Complete!</p>
            <p className="text-sm text-green-500 mt-2">File saved to Supabase Storage.</p>
          </div>
        ) : uploadStatus === "error" ? (
          <div className="flex flex-col items-center text-red-600">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">Upload Failed</p>
            <p className="text-sm mt-2">{errorMessage}</p>
            <button className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm" onClick={(e) => { e.stopPropagation(); setUploadStatus("idle"); }}>
              Try Again
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <UploadCloud className="w-12 h-12 mb-4 text-gray-400" />
            <p className="text-lg font-medium text-gray-900">Drag & drop your media here</p>
            <p className="text-sm mt-2">or click to browse</p>
            <p className="text-xs mt-4">Supported formats: JPG, PNG, MP4 (Max 50MB)</p>
          </div>
        )}
      </div>
    </div>
  );
}
