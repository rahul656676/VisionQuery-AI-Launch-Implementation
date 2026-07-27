import { AnalysisResults } from "@/components/AnalysisResults";

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis Results</h1>
          <p className="text-gray-500 mt-2">View the AI-extracted insights from your media.</p>
        </div>
        
        <AnalysisResults uploadId={resolvedParams.id} />
      </div>
    </div>
  );
}
