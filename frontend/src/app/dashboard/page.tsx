"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Image as ImageIcon, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/search/?query=${encodeURIComponent(searchQuery)}`, {
        headers: {
          "Bypass-Tunnel-Reminder": "true",
          "ngrok-skip-browser-warning": "true",
        }
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Search through past image analyses</p>
          </div>
          
          <form onSubmit={handleSearch} className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search OCR text, objects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none transition"
            />
          </form>
        </div>

        {/* Results Grid */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h2>
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed">
              <p className="text-gray-500">No results found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition p-5 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-blue-600">
                      <ImageIcon className="w-5 h-5 mr-2" />
                      <span className="font-medium text-sm">Image Analysis</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${job.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {job.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                    {job.results?.scene_summary || "No summary available."}
                  </p>
                  
                  <Link href={`/upload/${job.upload_id || "dummy-id-due-to-fk-error"}`} className="inline-flex items-center justify-center w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-800 text-sm font-medium rounded border transition">
                    View Results
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
