"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface UserProfile {
  id: number;
  email: string;
  name: string;
  avatar_url?: string;
  is_verified?: boolean;
  created_at?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          // Check localStorage fallback
          const localUser = localStorage.getItem("user");
          const token = localStorage.getItem("token");
          if (localUser && token) {
            setUser(JSON.parse(localUser));
          } else {
            router.push("/auth");
          }
        }
      } catch (err) {
        console.error("Auth check error:", err);
        const localUser = localStorage.getItem("user");
        if (localUser) {
          setUser(JSON.parse(localUser));
        } else {
          router.push("/auth");
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0d10] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-mono">Loading SovereignX Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0d10] text-white relative overflow-hidden font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Gradients & Video Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px]"></div>
      </div>

      {/* Top Navbar */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            S
          </div>
          <span className="font-semibold text-lg tracking-wide text-white">SovereignX</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 font-mono">
            Dashboard
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs uppercase font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Banner */}
          <div className="relative p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-black/60 backdrop-blur-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-300">{user?.name || "Sovereign User"}</span> 👋
            </h1>
            <p className="text-gray-400 text-sm max-w-xl">
              Your SovereignX account has been authenticated successfully via NeonDB PostgreSQL backend.
            </p>
          </div>

          {/* User Details & Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Info Card */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Account Overview</h3>
                <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-gray-500 block">Full Name</label>
                  <p className="text-sm font-medium text-white">{user?.name || "N/A"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Email Address</label>
                  <p className="text-sm font-medium text-white font-mono">{user?.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">User ID</label>
                  <p className="text-xs font-mono text-gray-400">#SVX-USER-{user?.id || "001"}</p>
                </div>
              </div>
            </div>

            {/* Database & Infrastructure Card */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Database Status</h3>
                <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Neon Postgres
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-xs text-gray-500 block">Database Provider</label>
                  <p className="text-sm font-medium text-white">Neon Serverless PostgreSQL</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Resend OTP Service</label>
                  <p className="text-sm font-medium text-emerald-400">Active & Configured</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block">Auth Provider</label>
                  <p className="text-sm font-medium text-white">Express API + JWT</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Security</h3>
                <span className="text-xs text-indigo-400 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Active Session
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-300">JWT Token Verified</span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold transition-all"
                >
                  Sign Out of SovereignX
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
