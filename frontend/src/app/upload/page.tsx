"use client";

import { UploadDropzone } from "@/components/UploadDropzone";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
          <p className="mt-2 text-sm text-gray-500">Upload an image or video to start the analysis pipeline.</p>
        </div>
        
        <UploadDropzone />
      </div>
    </div>
  );
}
