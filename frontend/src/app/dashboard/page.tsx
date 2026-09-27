"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SovereignWorkspace } from "@/components/sovereign/SovereignWorkspace";
import { UserProfileData } from "@/components/sovereign/types";
import { ShieldCheck } from "lucide-react";

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
        setTimeout(() => setLoading(false), 800); // Small delay for cinematic boot effect
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
      <div className="h-screen w-full bg-[#030406] text-white flex flex-col items-center justify-center font-sans overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-900 to-blue-900 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(0,163,255,0.2)] animate-pulse">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
          <p className="text-xs text-cyan-400/80 font-mono tracking-widest uppercase animate-pulse">
            Securing Workspace...
          </p>
        </div>
      </div>
    );
  }

  // Map existing auth user to Sovereign UserProfileData
  const workspaceUser: UserProfileData | null = user ? {
    name: user.name || "Authenticated User",
    email: user.email,
    status: user.is_verified ? "Verified" : "Authenticated",
  } : null;

  return (
    <SovereignWorkspace 
      user={workspaceUser} 
      onLogout={handleLogout} 
    />
  );
}
