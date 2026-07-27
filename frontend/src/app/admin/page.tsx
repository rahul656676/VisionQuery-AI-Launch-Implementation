"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { createClient } from "@/utils/supabase/client";
import { Users, Upload, AlertCircle, Server } from "lucide-react";

export default function AdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError("Not authenticated.");
          return;
        }

        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        setStats(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || err.message);
      }
    };
    fetchStats();
  }, [supabase.auth]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow border text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Access Denied</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-500">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and statistics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_users}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Uploads</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_uploads}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center space-x-4">
            <div className="p-3 bg-red-100 rounded-lg text-red-600">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Failed Jobs</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_failed_jobs}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border mt-8">
          <div className="flex items-center space-x-2 text-gray-900 mb-4">
            <Server className="w-5 h-5" />
            <h2 className="text-lg font-semibold">System Health</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${stats.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm font-medium text-gray-700 capitalize">{stats.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
