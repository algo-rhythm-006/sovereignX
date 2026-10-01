"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import {
  ShieldCheck, Terminal, Database, FileText, Lock, ScanSearch,
  FileCheck, Plus, Search, ChevronLeft, ChevronRight, LogOut,
  User, Folder, Settings, Bell, HelpCircle, Cpu, Network,
  Download, Paperclip, X, ArrowUp, Activity, CheckCircle,
  Clock, GitBranch, ChevronDown, Zap, Copy, ThumbsUp, ThumbsDown,
  RotateCcw, Workflow, Check, Menu, PanelLeft, PanelLeftClose, Image, Sparkles
} from "lucide-react";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";
import type { OrbState } from "@/components/ui/thinking-orbs";
import Avatar from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import { LiquidGlassCard, LiquidButton } from "@/components/ui/liquid-glass-card";
import FolderFloat from "@/components/ui/floating-folder";
import { ExecutionStatus, ChatMessageData, UserProfileData, TimelineStep, TimelineStepStatus } from "./types";

// ─── FONT ──────────────────────────────────────────────────────────────────────
const SF = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif';

// ─── PROPS ─────────────────────────────────────────────────────────────────────
interface SovereignWorkspaceProps {
  user: UserProfileData | null;
  onLogout: () => void;
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────
const PIPELINE_STEPS: TimelineStep[] = [
  { id: "s1", stepNumber: 1, title: "INTENT CLASSIFICATION", description: "Parsing semantic intent via local model", status: "pending" },
  { id: "s2", stepNumber: 2, title: "LOCAL INFERENCE", description: "llama-3-8b-instruct · GPU Cluster Active", status: "pending" },
  { id: "s3", stepNumber: 3, title: "RAG RETRIEVAL", description: "Querying sovereign knowledge base", status: "pending" },
  { id: "s4", stepNumber: 4, title: "DELIVERABLE SYNTHESIS", description: "Composing governed artifacts", status: "pending" },
  { id: "s5", stepNumber: 5, title: "AIR-GAP VERIFICATION", description: "Confirming zero network egress", status: "pending" },
];

const STEP_TIMING_MS: Partial<Record<ExecutionStatus, number>> = {
  classifying: 1100,
  executing: 1800,
  retrieving: 1600,
  synthesizing: 1400,
};

const QUICK_ACTIONS = [
  { icon: ScanSearch,  title: "Audit System Architecture", desc: "Map your attack surface and identify unapproved network egress paths.", tag: "Security" },
  { icon: FileCheck,   title: "Extract Compliance Report", desc: "Cross-reference documents against regulatory frameworks locally.", tag: "Compliance" },
  { icon: Terminal,    title: "Execute Sandbox Analysis", desc: "Run integrity scripts in a fully isolated local environment.", tag: "Sandbox" },
  { icon: GitBranch,   title: "Analyze Knowledge Graph", desc: "Build entity relationships from your sovereign document corpus.", tag: "Analysis" },
];

// ─── SIDEBAR ───────────────────────────────────────────────────────────────────
function Sidebar({
  collapsed, setCollapsed, user, onLogout, onNewExecution,
  activeMode, setActiveMode,
  historyList = [],
  searchQuery = "",
  setSearchQuery,
  onHistoryClick
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  user: UserProfileData | null;
  onLogout: () => void;
  onNewExecution: () => void;
  activeMode: "chat" | "image";
  setActiveMode: (v: "chat" | "image") => void;
  historyList?: any[];
  searchQuery?: string;
  setSearchQuery?: (v: string) => void;
  onHistoryClick?: (id: string) => void;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [kbOpen, setKbOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [folderOpen, setFolderOpen] = useState(false);

  const [documents, setDocuments] = useState<any[]>([]);
  
  const fetchDocuments = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/documents`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
    
    const handleRefetch = () => fetchDocuments();
    window.addEventListener("refetchKnowledgeBase", handleRefetch);
    return () => window.removeEventListener("refetchKnowledgeBase", handleRefetch);
  }, [fetchDocuments]);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(sidebarRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.1 });
      gsap.fromTo(".sb-item", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 1.0, ease: "power3.out", stagger: 0.1, delay: 0.4 });
    }, sidebarRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(sidebarRef.current, { width: collapsed ? 72 : 260, duration: 0.3, ease: "power3.inOut" });
    });
    return () => ctx.revert();
  }, [collapsed]);

  return (
    <div
      ref={sidebarRef}
      className={`absolute md:relative h-full flex flex-col shrink-0 overflow-hidden z-[100] transition-all duration-300 ${collapsed ? 'max-md:!w-0 max-md:!border-r-0 max-md:!opacity-0' : 'max-md:!w-[260px]'}`}
      style={{
        width: 260,
        background: "rgba(5,5,7,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div
        className="sb-item flex items-center justify-between px-3 shrink-0"
        style={{ height: 56, borderBottom: collapsed ? "none" : "1px solid rgba(255,255,255,0.06)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm" color="cyan" shape="squircle" />
            <span className="text-[15px] font-semibold text-white tracking-tight" style={{ fontFamily: SF }}>
              SovereignX
            </span>
          </div>
        )}
        
        {!collapsed ? (
          <button
            onClick={() => setCollapsed(true)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        ) : (
          <div className="w-full flex justify-center pt-2">
             <button onClick={() => setCollapsed(false)} className="group relative outline-none">
               <Avatar size="sm" color="cyan" shape="circle" />
               <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full transition-colors"></div>
             </button>
          </div>
        )}
      </div>

      {/* Collapsed icon strip */}
      {collapsed && (
        <div data-lenis-prevent="true" className="flex-1 flex flex-col items-center gap-4 py-4 overflow-y-auto w-[72px] mx-auto mt-2" style={{ scrollbarWidth: "none" }}>
          
          {/* New Execution */}
          <button 
            onClick={() => { setCollapsed(false); onNewExecution(); }} 
            className="relative overflow-hidden w-12 h-12 rounded-[14px] bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:shadow-[inset_0_0_0_1px_rgba(0,163,255,0.4)] flex items-center justify-center transition-all group shrink-0" 
            title="New Execution"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-80 pointer-events-none transition-opacity duration-200 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#00A3FF] blur-sm opacity-60 pointer-events-none transition-opacity duration-200 group-hover:opacity-80" />
            <Plus className="relative z-10 w-[22px] h-[22px] text-[#00A3FF] group-hover:text-white transition-colors" />
          </button>
          
          <div className="w-6 h-[1px] bg-white/10 my-1 shrink-0" />

          {/* Navigation Icons */}
          {[
            { icon: Search, title: "Search" },
            { icon: Image, title: "Image Engine" },
            { icon: ScanSearch, title: "Audit System Architecture" },
            { icon: FileCheck, title: "Extract Compliance" },
            { icon: Terminal, title: "Execute Sandbox" },
            { icon: Database, title: "Knowledge Base" },
          ].map((item: { icon: any; title: string; href?: string }, i) => {
            const Wrapper = item.href ? "a" : "button";
            const props: any = {
              key: i,
              className: "relative overflow-hidden w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:text-white bg-black/20 hover:bg-black/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-4px_20px_-4px_rgba(255,255,255,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-4px_20px_-4px_rgba(255,255,255,0.15)] transition-all duration-200 shrink-0 group",
              title: item.title,
            };
            if (item.title === "Image Engine") {
              props.onClick = () => { setCollapsed(false); setActiveMode("image"); };
            } else if (item.href) {
              props.href = item.href;
            } else {
              props.onClick = () => setCollapsed(false);
            }
            return (
              <Wrapper {...props}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 group-hover:opacity-100 pointer-events-none transition-opacity duration-200" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 group-hover:opacity-60 pointer-events-none transition-opacity duration-200" />
                <item.icon className="relative z-10 w-[22px] h-[22px] transition-colors duration-200" />
              </Wrapper>
            );
          })}

          {/* Bottom Profile / Settings */}
          <div className="mt-auto mb-6 flex flex-col gap-5 items-center shrink-0 w-full">
            <button 
              onClick={() => setCollapsed(false)} 
              className="relative overflow-hidden w-12 h-12 rounded-xl flex items-center justify-center text-white/50 hover:text-white bg-black/20 hover:bg-black/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-4px_20px_-4px_rgba(255,255,255,0.05)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-4px_20px_-4px_rgba(255,255,255,0.15)] transition-all duration-200 group" 
              title="Settings"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 group-hover:opacity-100 pointer-events-none transition-opacity duration-200" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 group-hover:opacity-60 pointer-events-none transition-opacity duration-200" />
              <Settings className="relative z-10 w-[22px] h-[22px] transition-colors duration-200" />
            </button>
            <button className="group relative outline-none" onClick={() => setCollapsed(false)}>
              <Avatar size="sm" color="white" shape="circle" />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-full transition-colors"></div>
            </button>
          </div>
        </div>
      )}

      {/* Expanded content — THIS IS SCROLLABLE */}
      {!collapsed && (
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto pb-36"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          {/* New + search */}
          <div className="sb-item px-3 py-2.5 space-y-1">
            <button
              onClick={onNewExecution}
              className="relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/90 hover:text-white transition-all duration-200 group"
              style={{
                background: "rgba(0,0,0,0.6)",
                boxShadow: "0 8px 32px -8px rgba(0, 163, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 -4px 20px -4px rgba(0, 163, 255, 0.3)",
                backdropFilter: "blur(24px)",
                fontFamily: SF
              }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#00A3FF] blur-sm opacity-60 pointer-events-none" />
              <Plus className="relative z-10 w-[18px] h-[18px] text-[#00A3FF] group-hover:text-white transition-colors" />
              <span className="relative z-10">New Execution</span>
            </button>
            <button
              className="relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/50 hover:text-white hover:bg-black/40 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-4px_20px_-4px_rgba(255,255,255,0.1)] transition-all duration-200 group"
              style={{ fontFamily: SF }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-0 group-hover:opacity-70 pointer-events-none transition-opacity duration-200" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-200" />
              <Search className="relative z-10 w-[18px] h-[18px] text-white/30 group-hover:text-white/80 transition-colors duration-200" />
              <span className="relative z-10">Search</span>
            </button>
            <button
              onClick={() => setActiveMode("image")}
              className="relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/90 hover:text-white transition-all duration-200 group mt-1"
              style={{
                background: "rgba(0,0,0,0.6)",
                boxShadow: "0 8px 32px -8px rgba(0, 163, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 -4px 20px -4px rgba(0, 163, 255, 0.3)",
                backdropFilter: "blur(24px)",
                fontFamily: SF
              }}
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-80 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#00A3FF] blur-sm opacity-60 pointer-events-none" />
              <Image className="relative z-10 w-[18px] h-[18px] text-[#00A3FF] group-hover:text-white transition-colors" />
              <span className="relative z-10">Image Engine</span>
            </button>
          </div>

          <div className="px-3 space-y-5 mt-2">
            {/* Workflows */}
            <div className="sb-item">
              <div className="flex items-center gap-1.5 px-2 mb-2 mt-2">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider" style={{ fontFamily: SF }}>
                  Workflows
                </span>
              </div>
              <div className="space-y-0.5">
                {[
                  { icon: ScanSearch, label: "Audit System Architecture", active: true },
                  { icon: FileCheck, label: "Extract Compliance" },
                  { icon: Terminal, label: "Execute Sandbox" },
                  { icon: Workflow, label: "Agentic Pipeline" },
                ].map(({ icon: Icon, label, active }) => (
                  <button
                    key={label}
                    className={`relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                      active 
                        ? "text-white bg-black/60 shadow-[0_8px_32px_-8px_rgba(0,163,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-4px_20px_-4px_rgba(0,163,255,0.3)] backdrop-blur-xl" 
                        : "text-white/50 hover:text-white hover:bg-black/60 hover:shadow-[0_8px_32px_-8px_rgba(0,163,255,0.2),inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-4px_20px_-4px_rgba(0,163,255,0.3)] hover:backdrop-blur-xl"
                    }`}
                    style={{ fontFamily: SF }}
                  >
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent pointer-events-none transition-opacity duration-200 ${active ? 'opacity-80' : 'opacity-0 group-hover:opacity-80'}`} />
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#00A3FF] blur-sm pointer-events-none transition-opacity duration-200 ${active ? 'opacity-60' : 'opacity-0 group-hover:opacity-60'}`} />
                    
                    <Icon className={`relative z-10 w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${active ? "text-[#00A3FF]" : "text-white/30 group-hover:text-[#00A3FF]"}`} />
                    <span className="relative z-10 truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>


            {/* Quick Actions (Floating Folder) */}
            <div className="sb-item">
              <div className="flex items-center gap-1.5 px-2 mb-2 mt-2">
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider" style={{ fontFamily: SF }}>
                  Quick Actions
                </span>
              </div>
              <div 
                className={`relative rounded-2xl p-4 pb-5 flex justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${folderOpen ? "pt-40" : "pt-6"}`}
                style={{
                  background: "rgba(0,0,0,0.6)",
                  boxShadow: "0 8px 32px -8px rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 -4px 20px -4px rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none rounded-b-2xl" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none rounded-b-2xl" />
                
                <FolderFloat 
                  items={QUICK_ACTIONS.map(a => a.title)}
                  label="Workflows"
                  sublabel="4 Available Actions"
                  folderColor="rgba(255,255,255,0.04)"
                  frontColor="rgba(255,255,255,0.08)"
                  paperColor="rgba(10,10,12,0.9)"
                  itemColor="rgba(255,255,255,0.1)"
                  itemTextColor="#e4e4e7"
                  labelColor="#ffffff"
                  width={210}
                  height={150}
                  onOpenChange={setFolderOpen}
                />
              </div>
            </div>

            {/* Knowledge Base */}
            <div className="sb-item">
              <button
                onClick={() => setKbOpen(!kbOpen)}
                className="w-full flex items-center justify-between px-2 mb-2 mt-4 group"
              >
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider group-hover:text-white/50 transition-colors" style={{ fontFamily: SF }}>
                  Knowledge Base
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-white/30 tabular-nums" style={{ fontFamily: SF }}>{documents.length}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${kbOpen ? "rotate-0" : "-rotate-90"}`} />
                </div>
              </button>
              {kbOpen && (
                <div 
                  className="relative overflow-hidden rounded-2xl p-1.5"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    boxShadow: "0 8px 32px -8px rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 -4px 20px -4px rgba(255, 255, 255, 0.12)",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
                  <div className="space-y-0.5 relative z-10">
                    {documents.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-white/30 italic text-center" style={{ fontFamily: SF }}>No documents uploaded</div>
                    ) : (
                      documents.map((doc: any, i: number) => (
                        <button
                          key={doc.filename}
                          className={`relative overflow-hidden w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-left group ${
                            i === 0
                              ? "text-white bg-black/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_0_-4px_20px_-4px_rgba(255,255,255,0.12)]"
                              : "text-white/50 hover:text-white hover:bg-black/40 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-4px_20px_-4px_rgba(255,255,255,0.08)]"
                          }`}
                        >
                          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent pointer-events-none transition-opacity duration-200 ${i === 0 ? 'opacity-70' : 'opacity-0 group-hover:opacity-70'}`} />
                          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm pointer-events-none transition-opacity duration-200 ${i === 0 ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'}`} />

                          <FileText className={`relative z-10 w-[18px] h-[18px] shrink-0 transition-colors duration-200 ${i === 0 ? "text-white/80" : "text-white/30 group-hover:text-white/80"}`} />
                          <span className="relative z-10 truncate text-[13px] font-medium" style={{ fontFamily: SF }} title={doc.filename}>
                            {doc.filename}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div className="sb-item">
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="w-full flex items-center justify-between px-2 mb-2 mt-4 group"
              >
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider group-hover:text-white/50 transition-colors" style={{ fontFamily: SF }}>
                  History
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/30 transition-transform duration-200 ${historyOpen ? "rotate-0" : "-rotate-90"}`} />
              </button>
              {historyOpen && (
                <div className="space-y-3 pb-1">
                  <div 
                    className="relative overflow-hidden rounded-2xl p-1.5"
                    style={{
                      background: "rgba(0,0,0,0.6)",
                      boxShadow: "0 8px 32px -8px rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 -4px 20px -4px rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
                    
                    <div className="space-y-0.5 relative z-10 pb-0.5">
                      {historyList && historyList.filter(h => !searchQuery || h.title.toLowerCase().includes(searchQuery.toLowerCase())).map((h: any) => (
                        <button
                          key={h.session_id}
                          onClick={() => onHistoryClick?.(h.session_id)}
                          className="relative overflow-hidden w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 text-left group text-white/50 hover:text-white hover:bg-black/40 hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05),inset_0_-4px_20px_-4px_rgba(255,255,255,0.08)]"
                          style={{ fontFamily: SF }}
                        >
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-0 group-hover:opacity-70 pointer-events-none transition-opacity duration-200" />
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-200" />
                          
                          <Clock className="relative z-10 w-[16px] h-[16px] shrink-0 text-white/30 group-hover:text-white/80 transition-colors duration-200" />
                          <span className="relative z-10 truncate">{h.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* User footer — fixed at bottom */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#050507] via-[#050507]/90 to-transparent z-0 pointer-events-none h-32"></div>
      )}
      {!collapsed && (
        <div className="sb-item absolute bottom-3 left-3 right-3 z-20">
          <div 
            className="relative flex items-center justify-between gap-3 px-3 py-3 rounded-2xl bg-black/60 backdrop-blur-xl w-full group cursor-pointer transition-colors hover:bg-black/80"
            style={{ 
              boxShadow: '0 4px 24px -6px rgba(0, 163, 255, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 -4px 12px -2px rgba(0, 163, 255, 0.3)'
            }}
          >
            {/* The Badge UI Glowing Bottom Borders */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-80" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#00A3FF] blur-sm opacity-60" />

            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar size="sm" color="white" shape="circle" />
            </div>
            
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <div className="text-[13px] font-semibold text-white/95 truncate tracking-tight" style={{ fontFamily: SF }}>
                {user?.name ?? "Prithvi Raj Thakur"}
              </div>
              <div className="text-[10px] text-white/50 mt-1" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace", lineHeight: "1.3" }}>
                <span className="text-[#00A3FF] font-semibold">PRO</span> <span className="opacity-50">·</span> System Admin
                <br/>
                <span className="text-white/30 text-[9px]">Secured Air-Gapped</span>
              </div>
            </div>
            
            <button 
              onClick={onLogout} 
              className="w-7 h-7 flex items-center justify-center rounded-full text-white/30 hover:text-[#00A3FF] hover:bg-[#00A3FF]/10 shrink-0 transition-all duration-300 relative z-10 group/btn"
              title="Settings"
            >
              <Settings className="w-3.5 h-3.5 group-hover/btn:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOPBAR ────────────────────────────────────────────────────────────────────
function Topbar({ onToggleSidebar, sidebarCollapsed }: { onToggleSidebar: () => void; sidebarCollapsed: boolean }) {
  const [statsOpen, setStatsOpen] = useState(false);
  const [wanKbs, setWanKbs] = useState<number>(0.0);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
        const res = await fetch(`${apiUrl}/api/v1/telemetry`);
        const data = await res.json();
        if (data.wan_ingress_kbs !== undefined) {
          setWanKbs(data.wan_ingress_kbs);
        }
      } catch (err) {
        // silently ignore fetch errors
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="flex items-center justify-between px-3 md:px-5 shrink-0 relative z-50"
      style={{
        height: 56,
        background: "rgba(5,5,7,0.90)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={onToggleSidebar} 
          className={`text-white/50 hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 ${!sidebarCollapsed ? 'md:hidden' : ''}`}
          title="Toggle Sidebar"
        >
          <Menu className="w-4 h-4 transition-colors duration-200 md:hidden" />
          <PanelLeft className="w-4 h-4 transition-colors duration-200 hidden md:block" />
        </button>
      </div>

      {/* Desktop Stats */}
      <div className="hidden md:flex items-center gap-1.5">
        {[
          { icon: Network, label: `WAN: ${wanKbs.toFixed(1)} KB/s`, warn: true },
          { icon: Cpu, label: "SLM: 3B" },
          { icon: Activity, label: "VRAM: 4 GB" },
        ].map(({ icon: Icon, label, warn }) => (
          <div
            key={label}
            className="relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px]"
            style={{
              color: warn ? "#F59E0B" : "rgba(255,255,255,0.8)",
              background: "rgba(0,0,0,0.6)",
              boxShadow: warn 
                ? "0 4px 16px -4px rgba(245, 158, 11, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 -4px 16px -4px rgba(245, 158, 11, 0.3)"
                : "0 4px 16px -4px rgba(0, 163, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 -4px 16px -4px rgba(0, 163, 255, 0.2)",
              backdropFilter: "blur(12px)",
              fontFamily: "Geist Mono, 'SF Mono', monospace"
            }}
          >
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent ${warn ? 'via-[#F59E0B]' : 'via-[#00A3FF]'} to-transparent opacity-80 pointer-events-none`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] ${warn ? 'bg-[#F59E0B]' : 'bg-[#00A3FF]'} blur-[2px] opacity-60 pointer-events-none`} />
            <Icon className={`relative z-10 w-3 h-3 ${warn ? 'text-[#F59E0B]' : 'text-[#00A3FF]'}`} />
            <span className="relative z-10">{label}</span>
          </div>
        ))}
      </div>

      {/* Mobile Stats Dropdown */}
      <div className="md:hidden relative">
        <button 
          onClick={() => setStatsOpen(!statsOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] hover:bg-white/5 transition-colors"
        >
          <Activity className="w-3 h-3 text-[#00A3FF]" />
          <span className="font-semibold tracking-wide text-white/80" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>System</span>
          <ChevronDown className={`w-3 h-3 text-white/50 transition-transform duration-200 ${statsOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {statsOpen && (
          <div className="absolute top-full right-0 mt-3 p-2 rounded-xl bg-black/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl border border-white/5 min-w-[150px] flex flex-col gap-1.5 z-50">
            {[
              { icon: Network, label: `WAN: ${wanKbs.toFixed(1)} KB/s`, warn: true },
              { icon: Cpu, label: "SLM: 3B" },
              { icon: Activity, label: "VRAM: 4 GB" },
            ].map(({ icon: Icon, label, warn }) => (
              <div
                key={label}
                className="relative overflow-hidden flex items-center gap-2 px-2 py-2 rounded-lg text-[10px]"
                style={{
                  color: warn ? "#F59E0B" : "rgba(255,255,255,0.8)",
                  background: warn ? "rgba(245, 158, 11, 0.1)" : "rgba(255,255,255,0.03)",
                  fontFamily: "Geist Mono, 'SF Mono', monospace"
                }}
              >
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent ${warn ? 'via-[#F59E0B]' : 'via-[#00A3FF]'} to-transparent opacity-80 pointer-events-none`} />
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[2px] ${warn ? 'bg-[#F59E0B]' : 'bg-[#00A3FF]'} blur-[2px] opacity-60 pointer-events-none`} />
                <Icon className={`relative z-10 w-3 h-3 ${warn ? 'text-[#F59E0B]' : 'text-[#00A3FF]'}`} />
                <span className="relative z-10 font-semibold tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

// ─── EXECUTION PIPELINE ─────────────────────────────────────────────────────────
function PipelinePanel({ status }: { status: ExecutionStatus }) {
  const getState = (idx: number): TimelineStepStatus => {
    const order: ExecutionStatus[] = ["classifying", "executing", "retrieving", "synthesizing", "completed"];
    const cur = order.indexOf(status);
    if (cur < 0) return "pending";
    if (idx < cur) return "completed";
    if (idx === cur && status !== "completed") return "running";
    if (idx === 4 && status === "completed") return "completed";
    return "pending";
  };

  let orbState: OrbState = "listening";
  let orbLabel = "Awaiting query";
  if (status === "classifying") { orbState = "solving"; orbLabel = "Classifying..."; }
  else if (status === "executing") { orbState = "working"; orbLabel = "Inferring..."; }
  else if (status === "retrieving") { orbState = "searching"; orbLabel = "Searching..."; }
  else if (status === "synthesizing") { orbState = "composing"; orbLabel = "Composing..."; }
  else if (status === "completed") { orbState = "shaping"; orbLabel = "Complete"; }

  if (status === "idle") return null;

  return (
    <div className="max-w-[840px] mx-auto px-4 mb-6">
      <div className="flex gap-4 p-4 rounded-[16px] overflow-hidden relative bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
        {/* Orb */}
        <div className="flex flex-col items-center gap-2 shrink-0 w-20">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center [&_canvas]:!w-10 [&_canvas]:!h-10"
            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <ThinkingOrb state={orbState} size={32} theme="dark" />
          </div>
          <span
            className="text-[9px] text-white/30 text-center leading-tight uppercase tracking-wider"
            style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}
          >
            {orbLabel}
          </span>
        </div>

        {/* Steps */}
        <div className="flex-1 grid grid-cols-5 gap-2">
          {PIPELINE_STEPS.map((step, i) => {
            const st = getState(i);
            const icons = [ShieldCheck, Terminal, Database, FileText, Lock];
            const Icon = icons[i];
            return (
              <div key={step.id} className={`flex flex-col gap-1.5 transition-opacity duration-500 ${st === "pending" ? "opacity-20" : "opacity-100"}`}>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 relative z-10 ${
                      st === "completed" ? "text-[#A1A1AA]" : st === "running" ? "text-white animate-pulse" : "text-white/20"
                    }`}
                    style={{
                      background: st === "completed" ? "rgba(161,161,170,0.12)" : st === "running" ? "rgba(161,161,170,0.2)" : "rgba(255,255,255,0.03)",
                      borderColor: st === "completed" ? "rgba(161,161,170,0.3)" : st === "running" ? "rgba(161,161,170,0.4)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  {i < 4 && (
                    <div
                      className="flex-1 h-px transition-colors duration-700 relative z-10"
                      style={{ background: st === "completed" ? "rgba(161,161,170,0.3)" : "rgba(255,255,255,0.06)" }}
                    />
                  )}
                </div>
                <div
                  className="text-[9px] leading-snug transition-colors duration-300"
                  style={{
                    color: st === "completed" ? "rgba(255,255,255,0.4)" : st === "running" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
                    fontFamily: "Geist Mono, 'SF Mono', monospace",
                  }}
                >
                  {step.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── CHAT MESSAGE ──────────────────────────────────────────────────────────────
function ChatMessage({ message, isLast }: { message: ChatMessageData; isLast?: boolean }) {
  const isUser = message.role === "user";
  const ref = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRegenerate = () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    // Simulate a regeneration delay before turning off the spinner
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" });
  }, [isUser]);

  if (isUser) {
    return (
      <div ref={ref} className="flex justify-end gap-3 max-w-[840px] mx-auto px-4 mb-6">
        <div className="max-w-[75%] flex flex-col items-end">
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 justify-end">
              {message.attachments.map(att => (
                <div key={att.id} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <FileText className="w-3 h-3 text-white/30" />
                  <span className="text-[11px] text-white/50 max-w-[140px] truncate" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>{att.name}</span>
                </div>
              ))}
            </div>
          )}
          <div
            className="rounded-[16px] rounded-br-sm px-4 py-3 relative overflow-hidden bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl"
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
            <p className="text-[14px] text-white/80 leading-relaxed relative z-10" style={{ fontFamily: SF }}>{message.content}</p>
          </div>
          <div className="flex justify-end mt-1.5">
            <span className="text-[10px] text-white/20" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>{message.timestamp}</span>
          </div>
        </div>
        <div className="shrink-0 mt-1">
          <Avatar size="sm" color="white" shape="circle" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="max-w-[840px] mx-auto px-4 mb-6"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar size="sm" color="cyan" shape="circle" />
        <span className="text-[13px] font-semibold text-white/90" style={{ fontFamily: SF }}>SovereignX</span>
        <div className="flex items-center gap-1.5">
          {["LOCAL", "RAG", "GOVERNED"].map(tag => (
            <div key={tag} className="relative overflow-hidden px-2 py-0.5 rounded-sm flex items-center justify-center bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-[#A1A1AA]">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
              <span className="relative z-10 text-[9px] font-mono tracking-widest uppercase">{tag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="pl-[36px] max-w-[88%]">
        
        {/* Render Steps */}
        {message.steps && message.steps.length > 0 && (
          <div className="mb-4 space-y-2">
            {message.steps.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-1 p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-2">
                  {step.status === "in_progress" ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-[#00A3FF] animate-spin" />
                  ) : step.status === "completed" ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5 text-[#A1A1AA]" />
                  )}
                  <span className="text-[12px] font-semibold text-white/90 font-mono tracking-tight">
                    {step.title}
                  </span>
                </div>
                {step.details && (
                  <p className="text-[11px] text-white/50 pl-5 leading-snug">{step.details}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Final Summary */}
        {message.content && (
          <div className="relative overflow-hidden p-4 rounded-[16px] rounded-bl-sm bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
            <p className="text-[14px] text-white/80 leading-[1.8] tracking-[-0.003em] relative z-10 whitespace-pre-wrap" style={{ fontFamily: SF }}>
              {message.content}
            </p>
          </div>
        )}

        {/* Deliverables */}
        {message.steps && message.steps.find(s => s.deliverables) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.steps.find(s => s.deliverables)?.deliverables?.map((d, i) => (
              <a key={i} href={`http://localhost:8000/api/v1/download/${d}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/40 border border-[#00A3FF]/30 hover:bg-[#00A3FF]/10 hover:border-[#00A3FF]/60 transition-colors">
                <FileText className="w-3.5 h-3.5 text-[#00A3FF]" />
                <span className="text-[11px] font-mono text-white/80">{d}</span>
                <Download className="w-3 h-3 text-white/40 ml-1" />
              </a>
            ))}
          </div>
        )}
        <div className={`flex items-center gap-0.5 mt-4 transition-opacity duration-200 ${showActions || isLast || feedback !== null || copied || isRegenerating ? "opacity-100" : "opacity-0"}`}>
          <button 
            title="Copy" 
            onClick={handleCopy}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 ${copied ? "text-emerald-400 bg-emerald-400/10" : "text-white/20 hover:text-white/50 hover:bg-white/5"}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          
          <button 
            title="Good" 
            onClick={() => setFeedback(prev => prev === "up" ? null : "up")}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 ${feedback === "up" ? "text-emerald-400 bg-emerald-400/10" : "text-white/20 hover:text-white/50 hover:bg-white/5"}`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${feedback === "up" ? "fill-emerald-400/20" : ""}`} />
          </button>
          
          <button 
            title="Bad" 
            onClick={() => setFeedback(prev => prev === "down" ? null : "down")}
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all duration-150 ${feedback === "down" ? "text-rose-400 bg-rose-400/10" : "text-white/20 hover:text-white/50 hover:bg-white/5"}`}
          >
            <ThumbsDown className={`w-3.5 h-3.5 ${feedback === "down" ? "fill-rose-400/20" : ""}`} />
          </button>
          
          <button 
            title="Regenerate" 
            onClick={handleRegenerate}
            className="w-7 h-7 rounded-md flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all duration-150 group"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRegenerating ? "animate-spin text-cyan-400" : "group-hover:-rotate-90 transition-transform duration-300"}`} />
          </button>

          <span className="text-[10px] text-white/20 ml-1.5" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
}

// ─── ARTIFACTS ────────────────────────────────────────────────────────────────
function Artifacts({ show }: { show: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !show) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
  }, [show]);
  if (!show) return null;

  return (
    <div ref={ref} className="max-w-[840px] mx-auto px-4 mb-6 pl-[52px]">
      <div className="rounded-[16px] overflow-hidden relative bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-xl max-w-[88%]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
        
        <div className="flex items-center gap-2 px-4 py-3 bg-[#111]/40 border-b border-white/5">
          <Folder className="w-3.5 h-3.5 text-[#A1A1AA]" />
          <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
            Governance Artifacts
          </span>
        </div>
        <div className="p-3 grid grid-cols-3 gap-2 relative z-10">
          {([] as any[]).map(artifact => (
            <div
              key={artifact.id}
              className="group flex flex-col gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(161,161,170,0.4)";
                (e.currentTarget as HTMLElement).style.background = "rgba(161,161,170,0.05)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 0 15px rgba(161,161,170,0.15)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
              }}
            >
              <div className="flex items-start gap-2">
                <div className="relative overflow-hidden h-6 px-2 rounded flex items-center justify-center shrink-0 bg-black/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] text-[#A1A1AA]">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
                  <span className="relative z-10 text-[9px] font-mono tracking-widest uppercase">{artifact.type}</span>
                </div>
                <span className="text-[11px] text-white/50 truncate pt-0.5 group-hover:text-white/80 transition-colors" title={artifact.filename} style={{ fontFamily: SF }}>
                  {artifact.filename}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
                  <CheckCircle className="w-2.5 h-2.5" />
                  {artifact.provenance}
                </span>
                <button className="flex items-center gap-1 text-[9px] text-white/30 hover:text-[#00A3FF] transition-colors duration-150" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
                  <Download className="w-2.5 h-2.5" />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ onAction }: { onAction: (q: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 1.0 });
      
      tl.fromTo(".es-logo", { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }, 0.3)
        .fromTo(".es-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.7")
        .fromTo(".es-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.9")
        .fromTo(".es-status-item", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: "power3.out", stagger: 0.15 }, "-=0.7");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex-1 min-h-full flex flex-col items-center justify-center px-6 gap-10 py-12">
      {/* Hero */}
      <div className="text-center max-w-lg">
        {/* Ambient glow orb */}
        <div className="es-logo relative w-16 h-16 mx-auto mb-8 flex justify-center items-center">
          <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(0,163,255,0.2)" }} />
          <div className="relative z-10">
            <Avatar size="lg" color="cyan" shape="squircle" />
          </div>
        </div>
        <h1
          className="es-title text-[30px] font-semibold tracking-[-0.03em] leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/20"
          style={{ fontFamily: SF }}
        >
          What are we securing today?
        </h1>
        <p className="es-desc text-[15px] text-white/40 leading-relaxed" style={{ fontFamily: SF }}>
          Query local models, search private knowledge, execute governed workflows —
          all inference remains within your air-gapped environment.
        </p>
      </div>

      {/* Status strip */}
      <div className="hidden md:flex items-center gap-3 text-[11px]" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
        {[
          "Air-Gapped Active",
          "Local Inference Ready",
          "0 Documents Indexed"
        ].map((label) => (
          <div key={label} className="es-status-item relative overflow-hidden px-4 py-1.5 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(255,255,255,0.08),inset_0_0_0_1px_rgba(255,255,255,0.08),inset_0_-4px_20px_-4px_rgba(255,255,255,0.12)] text-white/50">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-[#A1A1AA] to-transparent opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[3px] bg-[#A1A1AA] blur-sm opacity-30 pointer-events-none" />
            <span className="relative z-10 tracking-wide uppercase">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMPOSER ─────────────────────────────────────────────────────────────────
function Composer({ onExecute, isExecuting }: { onExecute: (q: string, files: File[]) => void; isExecuting: boolean }) {
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const canExecute = (query.trim().length > 0 || files.length > 0) && !isExecuting;
  const compRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!compRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(compRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.8 });
    });
    return () => ctx.revert();
  }, []);

  const handleExecute = useCallback(() => {
    if (!canExecute) return;
    onExecute(query, files);
    setQuery(""); setFiles([]);
  }, [query, files, canExecute, onExecute]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleExecute(); }
  };

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
  }, [query]);

  return (
    <div ref={compRef} className="shrink-0 px-4 pb-5 pt-2" style={{ background: "rgba(5,5,7,0.95)" }}>
      <div className="max-w-[840px] mx-auto">

        {/* File attachments */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg px-2.5 py-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <FileText className="w-3 h-3 text-white/30" />
                <span className="text-[11px] text-white/40 max-w-[160px] truncate" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>{f.name}</span>
                <button onClick={() => setFiles(files.filter((_, j) => j !== i))} className="text-white/20 hover:text-white/60 ml-0.5 transition-colors"><X className="w-3 h-3" /></button>
              </div>
            ))}
          </div>
        )}

        {/* Composer shell */}
        <div 
          className="relative rounded-2xl p-[1px] group transition-all duration-300"
          style={{
             boxShadow: focused 
               ? "0 20px 60px rgba(0,0,0,0.5), 0 0 50px -10px rgba(161, 161, 170, 0.3)" 
               : "0 20px 60px rgba(0,0,0,0.3), 0 0 30px -10px rgba(161, 161, 170, 0.15)",
          }}
        >
          {/* Animated Neon Border Layer */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
             <div className="absolute inset-[-50%] animate-[spin_4s_linear_infinite]" style={{
                background: "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(161, 161, 170, 0.5) 80%, rgba(161, 161, 170, 1) 100%)",
             }} />
          </div>

          {/* Static fallback border */}
          <div className="absolute inset-0 rounded-2xl border border-white/5 pointer-events-none" />

          {/* Inner Content Layer */}
          <div
            className="relative rounded-[15px] overflow-hidden transition-all duration-300 z-10 h-full w-full"
            style={{
              background: focused ? "rgba(20,20,25,0.85)" : "rgba(10,10,12,0.75)",
              boxShadow: focused 
                ? "inset 0 0 60px -10px rgba(161,161,170,0.2)" 
                : "inset 0 0 30px -10px rgba(161,161,170,0.1)",
              backdropFilter: "blur(24px)",
            }}
          >
          <div className="flex items-end gap-3 px-4 py-3.5">
            <label className="shrink-0 mb-0.5 text-white/25 hover:text-white/60 cursor-pointer transition-colors duration-150">
              <input type="file" multiple className="hidden" onChange={e => e.target.files && setFiles(p => [...p, ...Array.from(e.target.files!)])} disabled={isExecuting} />
              <Paperclip className="w-4 h-4" />
            </label>

            <textarea
              ref={textareaRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              disabled={isExecuting}
              placeholder="Ask SovereignX to analyze your workspace..."
              className="flex-1 bg-transparent border-none outline-none resize-none text-[14px] text-white/80 min-h-[24px] leading-relaxed py-0.5"
              style={{ fontFamily: SF, caretColor: "#00A3FF" }}
              rows={1}
            />

            <button
              onClick={handleExecute}
              disabled={!canExecute}
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
              style={canExecute
                ? { background: "#00A3FF", color: "#000", boxShadow: "0 0 20px rgba(0,163,255,0.4)" }
                : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }}
            >
              {isExecuting
                ? <span className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white/60 animate-spin" />
                : <ArrowUp className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] text-white/25 hover:text-white/50 hover:bg-white/5 transition-all duration-150" style={{ fontFamily: SF }}>
                <Zap className="w-3 h-3" />
                <span>Quick actions</span>
              </button>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-white/15" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>⌘↵ to execute</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-400/60" />
                <span className="text-[10px] text-emerald-400/50" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>Zero egress</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// ─── IMAGE GEN STATE ────────────────────────────────────────────────────────────
function ImageGenState({ payload, setPayload, isGenerating, generatedImage, onGenerate, showRatios, setShowRatios }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 1.0 });
      tl.fromTo(".ig-logo", { y: -30, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power3.out" }, 0.3)
        .fromTo(".ig-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.7")
        .fromTo(".ig-desc", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.9")
        .fromTo(".ig-panel", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, "-=0.7");
    }, ref);
    return () => ctx.revert();
  }, [generatedImage, isGenerating]); // Re-run animation if image state changes

  const RATIOS = ["1:1", "16:9", "9:16", "3:2", "4:3"];
  const STYLES = ["Photorealistic", "Technical Schematic", "Isometric", "Cyberpunk"];

  return (
    <div ref={ref} className="flex-1 min-h-full flex flex-col items-center justify-center px-6 gap-6 py-12">
      
      {generatedImage ? (
        <div className="ig-panel w-full max-w-[512px] mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,163,255,0.15)] mb-2 bg-black/40 backdrop-blur-xl flex items-center justify-center min-h-[300px]">
          <img src={generatedImage} alt="Generated Asset" className="w-full h-auto object-contain" />
        </div>
      ) : isGenerating ? (
        <div className="ig-panel w-full max-w-[512px] mx-auto rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,163,255,0.15)] mb-2 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center min-h-[300px] gap-6">
           <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-l-2 border-transparent border-t-[#00A3FF] border-b-[#00A3FF] animate-[spin_1.5s_linear_infinite]" />
           <p className="text-[#00A3FF] animate-pulse text-sm font-mono tracking-widest uppercase">Synthesizing Asset...</p>
        </div>
      ) : (
        <div className="text-center max-w-lg mb-4">
          <div className="ig-logo relative w-16 h-16 mx-auto mb-6 flex justify-center items-center">
            <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(0,163,255,0.2)" }} />
            <div className="relative z-10 w-16 h-16 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,163,255,0.2)]">
              <Image className="w-8 h-8 text-[#00A3FF]" />
            </div>
          </div>
          <h1 className="ig-title text-[30px] font-semibold tracking-[-0.03em] leading-tight mb-3 text-transparent bg-clip-text bg-gradient-to-b from-white/60 to-white/20" style={{ fontFamily: SF }}>
            Create images
          </h1>
          <p className="ig-desc text-[15px] text-white/40 leading-relaxed" style={{ fontFamily: SF }}>
            Create with SovereignX Image Engine (Local GPU)
          </p>
        </div>
      )}

      <div className="ig-panel w-full max-w-[700px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[16px] p-4 flex flex-col shadow-[0_8px_32px_-8px_rgba(0,163,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.05)] transition-all focus-within:border-[#00A3FF]/40 focus-within:shadow-[0_8px_32px_-8px_rgba(0,163,255,0.2),inset_0_0_0_1px_rgba(0,163,255,0.2)]">
        <textarea
          value={payload.prompt}
          onChange={(e) => setPayload({ ...payload, prompt: e.target.value })}
          placeholder="Ask SovereignX to generate an image..."
          className="w-full bg-transparent text-white/90 placeholder:text-white/30 text-[14px] resize-none outline-none min-h-[80px] p-2 leading-relaxed"
          style={{ fontFamily: SF, caretColor: "#00A3FF" }}
        />
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10 relative">
          <div className="relative">
            <button 
              onClick={() => setShowRatios(!showRatios)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-sm text-white/70 hover:border-white/30 transition-colors"
            >
              {payload.ratio} <ChevronDown className="w-3 h-3 text-white/50" />
            </button>
            {showRatios && (
              <div className="absolute bottom-full mb-2 left-0 w-24 bg-black/90 border border-white/10 rounded-lg overflow-hidden z-50 backdrop-blur-xl">
                {RATIOS.map(r => (
                  <button 
                    key={r}
                    onClick={() => { setPayload({ ...payload, ratio: r }); setShowRatios(false); }}
                    className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/10 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onGenerate}
            disabled={!payload.prompt || isGenerating}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#00A3FF] hover:bg-[#00A3FF]/80 text-black font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(0,163,255,0.4)]"
          >
            {isGenerating ? "Generating..." : "Generate"}
            {!isGenerating && <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="ig-panel w-full max-w-[700px] mt-2 flex flex-col gap-3">
        <span className="text-xs font-mono text-white/40 uppercase tracking-wider ml-1">Style Presets</span>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {STYLES.map(style => {
            const isActive = payload.style === style;
            return (
              <button
                key={style}
                onClick={() => setPayload({ ...payload, style: isActive ? "" : style })}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                  isActive 
                    ? "bg-[#00A3FF]/10 text-[#00A3FF] border-[#00A3FF]/50 shadow-[0_0_15px_rgba(0,163,255,0.2)]" 
                    : "bg-black/40 text-white/60 border-white/10 hover:border-white/30 hover:text-white/90"
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN WORKSPACE ────────────────────────────────────────────────────────────
export function SovereignWorkspace({ user, onLogout }: SovereignWorkspaceProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMode, setActiveMode] = useState<"chat" | "image">("chat");
  const [imgPrompt, setImgPrompt] = useState("");
  const [imgRatio, setImgRatio] = useState("1:1");
  const [imgStyle, setImgStyle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showRatios, setShowRatios] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [sessionId, setSessionId] = useState<string>(() => "sess_" + Date.now().toString());
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"}/api/v1/history`);
        if (res.ok) {
          const data = await res.json();
          setHistoryList(data);
        }
      } catch (e) {
        console.error("Failed to fetch history:", e);
      }
    };
    fetchHistory();
  }, [messages.length]); // refetch when messages change (new chat saved)

  const handleGenerateImage = async () => {
    if (!imgPrompt) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const finalPrompt = imgStyle ? `${imgPrompt}, ${imgStyle} style` : imgPrompt;
      const res = await fetch(`${process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"}/api/v1/generate-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt, num_inference_steps: 20 })
      });
      const data = await res.json();
      if (data.success && data.filepath_url) {
        setGeneratedImage(`${process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000"}${data.filepath_url}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };
  const [execStatus, setExecStatus] = useState<ExecutionStatus>("idle");
  const [showArtifacts, setShowArtifacts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const topbarRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!topbarRef.current || !bgRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 2.0, ease: "power2.out" });
      gsap.fromTo(topbarRef.current, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out", delay: 0.2 });
    });
    return () => ctx.revert();
  }, []);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, execStatus, scrollToBottom]);

      const handleHistoryClick = useCallback(async (id: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";
      const res = await fetch(apiUrl + "/api/v1/history/" + id);
      if (res.ok) {
        const data = await res.json();
        setSessionId(id);
        const mappedMsgs = data.messages.map((m: any, i: number) => ({
          id: "h-" + id + "-" + i,
          role: m.role,
          content: m.content
        }));
        setMessages(mappedMsgs);
        setActiveMode("chat");
        setExecStatus("completed");
      }
    } catch (e) {
      console.error("Failed to load history session:", e);
    }
  }, []);

  const handleNewExecution = useCallback(() => {
    setActiveMode("chat");
    setSessionId("sess_" + Date.now().toString());
    setMessages([]); setExecStatus("idle"); setShowArtifacts(false);
  }, []);

    const handleExecute = useCallback(async (query: string, files: File[]) => {
    if (!["idle", "completed", "error"].includes(execStatus)) return;

    let base64Image = undefined;
    let activeFilename = undefined;
    if (files.length > 0) {
      const file = files[0];
      activeFilename = file.name;
      if (file.type.startsWith("image/")) {
        base64Image = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }
    }

    const userMsg: ChatMessageData = {
      id: "u-" + Date.now(), role: "user",
      content: query || "Uploading " + files.length + " file(s)",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      attachments: files.map((f, i) => ({ id: "a" + i, name: f.name, type: f.type })),
    };
    setMessages(prev => [...prev, userMsg]);
    setShowArtifacts(false);

    const aiMsgId = "a-" + Date.now();
    const aiMsg: ChatMessageData = {
      id: aiMsgId, role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      metadata: { model: "llama-3-8b-instruct", rag: true, governed: true },
    };
    setMessages(prev => [...prev, aiMsg]);
    setExecStatus("executing");

    const apiUrl = process.env.NEXT_PUBLIC_AI_API_URL || "http://localhost:8000";

    try {
      const response = await fetch(apiUrl + "/api/v1/agent-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            prompt: query, 
            session_id: sessionId,
            active_filename: activeFilename,
            image_data: base64Image
        }),
      });

      if (response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        const errorText = errorData.error || "System Warning: Query blocked for safety.";
        setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: errorText } : m));
        setExecStatus("error");
        return;
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
            const line = buffer.slice(0, newlineIndex);
            buffer = buffer.slice(newlineIndex + 1);
            if (line.startsWith("data:")) {
              let dataText = line.substring(5);
              if (dataText.startsWith(" ")) dataText = dataText.substring(1);
              if (dataText.trim() === "[DONE]") {
                done = true;
                break;
              }
              try {
                const parsed = JSON.parse(dataText);
                setMessages(prev => prev.map(m => {
                  if (m.id === aiMsgId) {
                    const currentSteps = m.steps || [];
                    const newSteps = [...currentSteps];
                    
                    if (parsed.step !== undefined) {
                      const stepIndex = newSteps.findIndex(s => s.step === parsed.step);
                      if (stepIndex >= 0) {
                        newSteps[stepIndex] = { ...newSteps[stepIndex], ...parsed };
                      } else {
                        newSteps.push(parsed);
                      }
                    }
                    
                    let newContent = m.content;
                    if (parsed.final_summary) {
                      newContent = parsed.final_summary;
                    }

                    return { ...m, steps: newSteps, content: newContent };
                  }
                  return m;
                }));
              } catch (e) {
                console.warn("Could not parse SSE data:", dataText);
              }
            }
          }
        }
      }
      setExecStatus("completed");
    } catch (err) {
      console.error(err);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, content: "Error connecting to AI Backend." } : m));
      setExecStatus("error");
    }
    setTimeout(() => setExecStatus("idle"), 600);
  }, [execStatus]);

  const isExecuting = !["idle", "completed", "error"].includes(execStatus);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#050507", fontFamily: SF }}>

      {/* Ambient background glow — animated atmosphere */}
      <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <style>{`
          @keyframes float-1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(-50px, 50px) scale(1.2); }
          }
          @keyframes float-2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            50% { transform: translate(50px, -50px) scale(1.15); }
          }
        `}</style>
        <div
          className="absolute top-[-20%] left-[10%] w-[800px] h-[800px] rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(161,161,170,0.06) 0%, transparent 60%)", 
            filter: "blur(80px)",
            animation: "float-1 20s ease-in-out infinite"
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[10%] w-[600px] h-[600px] rounded-full"
          style={{ 
            background: "radial-gradient(circle, rgba(161,161,170,0.05) 0%, transparent 60%)", 
            filter: "blur(60px)",
            animation: "float-2 25s ease-in-out infinite"
          }}
        />
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

            <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
        onLogout={onLogout}
        onNewExecution={handleNewExecution}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        historyList={historyList}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onHistoryClick={handleHistoryClick}
      />

      {/* Main — does NOT scroll, it's a fixed layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <div ref={topbarRef} className="shrink-0 z-20">
          <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} sidebarCollapsed={sidebarCollapsed} />
        </div>

        {/* Chat area — also does NOT overflow-scroll, only the message list does */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeMode === "image" ? (
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
              <ImageGenState 
                payload={{ prompt: imgPrompt, ratio: imgRatio, style: imgStyle }}
                setPayload={(p: any) => { setImgPrompt(p.prompt); setImgRatio(p.ratio); setImgStyle(p.style); }}
                isGenerating={isGenerating}
                generatedImage={generatedImage}
                onGenerate={handleGenerateImage}
                showRatios={showRatios}
                setShowRatios={setShowRatios}
              />
            </div>
          ) : messages.length === 0 ? (
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
              <EmptyState onAction={q => handleExecute(q, [])} />
            </div>
          ) : (
            <div
              ref={scrollRef}
              data-lenis-prevent="true"
              className="flex-1 overflow-y-auto py-8"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}
            >
              {messages.map((msg, i) => (
                <ChatMessage key={msg.id} message={msg} isLast={i === messages.length - 1} />
              ))}
              <PipelinePanel status={execStatus} />
              <Artifacts show={showArtifacts} />
            </div>
          )}
        </div>

        {activeMode === "chat" && <Composer onExecute={handleExecute} isExecuting={isExecuting} />}
      </div>
    </div>
  );
}








