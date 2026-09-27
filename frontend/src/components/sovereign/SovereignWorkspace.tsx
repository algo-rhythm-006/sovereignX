"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import {
  ShieldCheck, Terminal, Database, FileText, Lock, ScanSearch,
  FileCheck, Plus, Search, ChevronLeft, ChevronRight, LogOut,
  User, Folder, Settings, Bell, HelpCircle, Cpu, Network,
  Download, Paperclip, X, ArrowUp, Activity, CheckCircle,
  Clock, GitBranch, ChevronDown, Zap, Copy, ThumbsUp, ThumbsDown,
  RotateCcw, Workflow
} from "lucide-react";
import { ThinkingOrb } from "@/components/ui/thinking-orbs";
import type { OrbState } from "@/components/ui/thinking-orbs";
import Avatar from "@/components/ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";
import { ExecutionStatus, ChatMessageData, UserProfileData, TimelineStep, TimelineStepStatus } from "./types";
import { MOCK_KNOWLEDGE_BASE, MOCK_ARTIFACTS, MOCK_HISTORY } from "./mockWorkspaceData";

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
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  user: UserProfileData | null;
  onLogout: () => void;
  onNewExecution: () => void;
}) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [kbOpen, setKbOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  useEffect(() => {
    if (!sidebarRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(sidebarRef.current, { width: collapsed ? 56 : 260, duration: 0.3, ease: "power3.inOut" });
    });
    return () => ctx.revert();
  }, [collapsed]);

  return (
    <div
      ref={sidebarRef}
      className="relative h-full flex flex-col shrink-0 overflow-hidden"
      style={{
        width: 260,
        background: "rgba(5,5,7,0.95)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 shrink-0"
        style={{ height: 56, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-[8px] flex items-center justify-center"
              style={{
                background: "rgba(0,163,255,0.15)",
                border: "1px solid rgba(0,163,255,0.3)",
                boxShadow: "0 0 12px rgba(0,163,255,0.2)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A3FF]" />
            </div>
            <span className="text-[15px] font-semibold text-white tracking-tight" style={{ fontFamily: SF }}>
              SovereignX
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150 ${collapsed ? "mx-auto" : ""}`}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsed icon strip */}
      {collapsed && (
        <div className="flex-1 flex flex-col items-center gap-1 py-3 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <button onClick={onNewExecution} className="w-8 h-8 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150" title="New Execution">
            <Plus className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150" title="Search">
            <Search className="w-3.5 h-3.5" />
          </button>
          <div className="w-5 h-px bg-white/6 my-1" />
          {[ScanSearch, Database, FileCheck, Terminal].map((Icon, i) => (
            <button key={i} className="w-8 h-8 rounded-md flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all duration-150">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <div className="mt-auto mb-2">
            <div className="w-7 h-7 rounded-full bg-white/8 border border-white/10 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-white/40" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded content — THIS IS SCROLLABLE */}
      {!collapsed && (
        <div
          className="flex-1 overflow-y-auto pb-20"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          {/* New + search */}
          <div className="px-3 py-2.5 space-y-1">
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200"
              style={{ fontFamily: SF }}
            >
              <Search className="w-[18px] h-[18px]" />
              Search
            </button>
          </div>

          <div className="px-3 space-y-5 mt-2">
            {/* Workflows */}
            <div>
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

            {/* Knowledge Base */}
            <div>
              <button
                onClick={() => setKbOpen(!kbOpen)}
                className="w-full flex items-center justify-between px-2 mb-2 mt-4 group"
              >
                <span className="text-xs font-semibold text-white/30 uppercase tracking-wider group-hover:text-white/50 transition-colors" style={{ fontFamily: SF }}>
                  Knowledge Base
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-white/30 tabular-nums" style={{ fontFamily: SF }}>{MOCK_KNOWLEDGE_BASE.length}</span>
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
                    {MOCK_KNOWLEDGE_BASE.map((file, i) => (
                      <button
                        key={file.id}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-left ${
                          i === 0
                            ? "text-white/90 bg-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                            : "text-white/50 hover:text-white/90 hover:bg-white/5"
                        }`}
                      >
                        <FileText className={`w-[18px] h-[18px] shrink-0 ${i === 0 ? "text-white/70" : "text-white/30"}`} />
                        <span className="truncate text-[13px] font-medium" style={{ fontFamily: SF }}>
                          {file.filename}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* History */}
            <div>
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
                <div className="space-y-3">
                  {(["Today", "Yesterday", "Older"] as const).map((group) => {
                    const items = MOCK_HISTORY.filter(h => h.date === group);
                    if (!items.length) return null;
                    return (
                      <div key={group}>
                        <div className="px-3 mb-1.5 mt-2 text-[11px] font-semibold text-white/20 uppercase tracking-wider" style={{ fontFamily: SF }}>
                          {group}
                        </div>
                        {items.map(h => (
                          <button
                            key={h.id}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[14px] font-medium text-white/40 hover:text-white/80 hover:bg-white/5 transition-all duration-200 text-left"
                            style={{ fontFamily: SF }}
                          >
                            <Clock className="w-4 h-4 shrink-0 text-white/20" />
                            <span className="truncate">{h.title}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User footer — fixed at bottom */}
      {!collapsed && (
        <div
          className="absolute bottom-0 left-0 right-0 px-3 py-3 shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(5,5,7,0.98)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white/6 border border-white/10 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-white/70 truncate" style={{ fontFamily: SF }}>
                {user?.name ?? "User"}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[10px] text-white/30" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
                  Verified · Air-Gapped
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-150"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TOPBAR ────────────────────────────────────────────────────────────────────
function Topbar({ onToggleSidebar, sidebarCollapsed }: { onToggleSidebar: () => void; sidebarCollapsed: boolean }) {
  return (
    <header
      className="flex items-center justify-between px-5 shrink-0"
      style={{
        height: 56,
        background: "rgba(5,5,7,0.90)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex items-center gap-3">
        {sidebarCollapsed && (
          <button onClick={onToggleSidebar} className="text-white/30 hover:text-white/70 transition-colors mr-1">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        <span
          className="text-[12px] text-white/30"
          style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}
        >
          SovereignX / Enterprise AI Workspace
        </span>
        <div className="h-3 w-px bg-white/8" />
        <div className="flex items-center gap-1.5">
          {[
            { label: "AIR-GAPPED", color: "#10B981" },
            { label: "LOCAL INFERENCE", color: "#00A3FF" },
            { label: "RAG ACTIVE", color: "#8B5CF6" },
          ].map(({ label, color }) => (
            <span
              key={label}
              className="text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full"
              style={{
                color,
                backgroundColor: `${color}14`,
                border: `1px solid ${color}30`,
                fontFamily: "Geist Mono, 'SF Mono', monospace",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {[
          { icon: Network, label: "WAN: 0 KB/s", warn: true },
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
        <div className="flex items-center gap-0.5 ml-1">
          {[Bell, Settings, HelpCircle].map((Icon, i) => (
            <button key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/5 transition-all duration-150">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
          <div className="w-7 h-7 rounded-full bg-white/6 border border-white/10 flex items-center justify-center ml-1">
            <User className="w-3.5 h-3.5 text-white/40" />
          </div>
        </div>
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
    <div className="max-w-[720px] mx-auto px-4 mb-6">
      <div
        className="flex gap-4 p-4 rounded-2xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
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
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                      st === "completed" ? "text-[#00A3FF]" : st === "running" ? "text-[#00A3FF]/70 animate-pulse" : "text-white/20"
                    }`}
                    style={{
                      background: st === "completed" ? "rgba(0,163,255,0.12)" : st === "running" ? "rgba(0,163,255,0.06)" : "rgba(255,255,255,0.03)",
                      borderColor: st === "completed" ? "rgba(0,163,255,0.3)" : st === "running" ? "rgba(0,163,255,0.15)" : "rgba(255,255,255,0.08)",
                    }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  {i < 4 && (
                    <div
                      className="flex-1 h-px transition-colors duration-700"
                      style={{ background: st === "completed" ? "rgba(0,163,255,0.3)" : "rgba(255,255,255,0.06)" }}
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

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { opacity: 0, y: isUser ? 8 : 4 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" });
  }, [isUser]);

  if (isUser) {
    return (
      <div ref={ref} className="flex justify-end max-w-[720px] mx-auto px-4 mb-6">
        <div className="max-w-[75%]">
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
            className="rounded-[16px] rounded-br-sm px-4 py-3"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p className="text-[14px] text-white/80 leading-relaxed" style={{ fontFamily: SF }}>{message.content}</p>
          </div>
          <div className="flex justify-end mt-1.5">
            <span className="text-[10px] text-white/20" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>{message.timestamp}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="max-w-[720px] mx-auto px-4 mb-6"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar size="sm" color="cyan" shape="circle" />
        <span className="text-[13px] font-semibold text-white/90" style={{ fontFamily: SF }}>SovereignX</span>
        <div className="flex items-center gap-1">
          {["LOCAL", "RAG"].map(tag => (
            <span
              key={tag}
              className="text-[9px] text-white/30 px-1.5 py-0.5 rounded"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Geist Mono, 'SF Mono', monospace" }}
            >
              {tag}
            </span>
          ))}
          <span
            className="text-[9px] px-1.5 py-0.5 rounded"
            style={{ color: "#10B981", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", fontFamily: "Geist Mono, 'SF Mono', monospace" }}
          >
            GOVERNED
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="pl-[36px]">
        <p className="text-[14px] text-white/70 leading-[1.8] tracking-[-0.003em]" style={{ fontFamily: SF }}>
          {message.content}
        </p>
        <div className={`flex items-center gap-0.5 mt-4 transition-opacity duration-200 ${showActions || isLast ? "opacity-100" : "opacity-0"}`}>
          {[{ icon: Copy, label: "Copy" }, { icon: ThumbsUp, label: "Good" }, { icon: ThumbsDown, label: "Bad" }, { icon: RotateCcw, label: "Regenerate" }].map(({ icon: Icon, label }) => (
            <button key={label} title={label} className="w-7 h-7 rounded-md flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/5 transition-all duration-150">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
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
    <div ref={ref} className="max-w-[720px] mx-auto px-4 mb-6 pl-[52px]">
      <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <Folder className="w-3.5 h-3.5 text-white/30" />
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-widest" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
            Governance Artifacts
          </span>
        </div>
        <div className="p-3 grid grid-cols-3 gap-2">
          {MOCK_ARTIFACTS.map(artifact => (
            <div
              key={artifact.id}
              className="group flex flex-col gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,163,255,0.2)";
                (e.currentTarget as HTMLElement).style.background = "rgba(0,163,255,0.04)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-white/30" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", fontFamily: "Geist Mono, 'SF Mono', monospace", fontSize: "9px" }}>
                  {artifact.type}
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
      gsap.fromTo(ref.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="flex-1 flex flex-col items-center justify-center px-6 gap-10 py-12">
      {/* Hero */}
      <div className="text-center max-w-lg">
        {/* Ambient glow orb */}
        <div className="relative w-16 h-16 mx-auto mb-8 flex justify-center items-center">
          <div className="absolute inset-0 rounded-full blur-2xl" style={{ background: "rgba(0,163,255,0.2)" }} />
          <div className="relative z-10">
            <Avatar size="lg" color="cyan" shape="squircle" />
          </div>
        </div>
        <h1
          className="text-[30px] font-semibold tracking-[-0.03em] text-white leading-tight mb-4"
          style={{ fontFamily: SF }}
        >
          What are we securing today?
        </h1>
        <p className="text-[15px] text-white/40 leading-relaxed" style={{ fontFamily: SF }}>
          Query local models, search private knowledge, execute governed workflows —
          all inference remains within your air-gapped environment.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[640px]">
        {QUICK_ACTIONS.map(({ icon: Icon, title, desc, tag }) => (
          <button
            key={title}
            onClick={() => onAction(title)}
            className="group flex flex-col gap-3 p-4 rounded-2xl text-left transition-all duration-200"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
            }}
          >
            <div className="flex items-start justify-between">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon className="w-4 h-4 text-white/30 group-hover:text-[#00A3FF] transition-colors duration-200" />
              </div>
              <span
                className="text-[9px] text-white/20 px-1.5 py-0.5 rounded-full uppercase tracking-widest"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "Geist Mono, 'SF Mono', monospace" }}
              >
                {tag}
              </span>
            </div>
            <div>
              <div className="text-[13px] font-medium text-white/70 group-hover:text-white mb-1 transition-colors duration-200" style={{ fontFamily: SF }}>{title}</div>
              <div className="text-[12px] text-white/30 leading-relaxed" style={{ fontFamily: SF }}>{desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Status strip */}
      <div className="flex items-center gap-6 text-[11px] text-white/25" style={{ fontFamily: "Geist Mono, 'SF Mono', monospace" }}>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Air-Gapped Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF]" />
          <span>Local Inference Ready</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
          <span>{MOCK_KNOWLEDGE_BASE.length} Documents Indexed</span>
        </div>
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
    <div className="shrink-0 px-4 pb-5 pt-2" style={{ background: "rgba(5,5,7,0.95)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-[720px] mx-auto">

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
        <BorderBeam size="md" colorVariant="ice" brightness={4} glowSize={2.5} saturation={2} hueRange={0} strength={1.2}>
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-300"
          style={{
            background: focused ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
            border: focused ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: focused ? "0 0 0 3px rgba(0,163,255,0.06), 0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(0,0,0,0.3)",
            backdropFilter: "blur(20px)",
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
        </BorderBeam>
      </div>
    </div>
  );
}

// ─── MAIN WORKSPACE ────────────────────────────────────────────────────────────
export function SovereignWorkspace({ user, onLogout }: SovereignWorkspaceProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [execStatus, setExecStatus] = useState<ExecutionStatus>("idle");
  const [showArtifacts, setShowArtifacts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, execStatus, scrollToBottom]);

  const handleNewExecution = useCallback(() => {
    setMessages([]); setExecStatus("idle"); setShowArtifacts(false);
  }, []);

  const handleExecute = useCallback(async (query: string, files: File[]) => {
    if (!["idle", "completed", "error"].includes(execStatus)) return;

    const userMsg: ChatMessageData = {
      id: `u-${Date.now()}`, role: "user",
      content: query || `Uploading ${files.length} file(s)`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      attachments: files.map((f, i) => ({ id: `a${i}`, name: f.name, type: f.type })),
    };
    setMessages(prev => [...prev, userMsg]);
    setShowArtifacts(false);

    const pipeline: ExecutionStatus[] = ["classifying", "executing", "retrieving", "synthesizing"];
    for (const step of pipeline) {
      setExecStatus(step);
      await new Promise(r => setTimeout(r, STEP_TIMING_MS[step] ?? 1500));
    }
    setExecStatus("completed");

    const aiMsg: ChatMessageData = {
      id: `a-${Date.now()}`, role: "assistant",
      content: `Analysis complete. I've processed your query "${query}" using the sovereign knowledge base. The local inference model identified 3 compliance vectors and 2 architectural anomalies across your indexed corpus. Three governed artifacts have been generated for your review. All computation was performed within the air-gapped environment — zero external network calls were made.`,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      metadata: { model: "llama-3-8b-instruct", rag: true, governed: true },
    };
    setMessages(prev => [...prev, aiMsg]);
    setShowArtifacts(true);
    setTimeout(() => setExecStatus("idle"), 600);
  }, [execStatus]);

  const isExecuting = !["idle", "completed", "error"].includes(execStatus);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#050507", fontFamily: SF }}>

      {/* Ambient background glow — matching landing page atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,163,255,0.04) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.03) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        user={user}
        onLogout={onLogout}
        onNewExecution={handleNewExecution}
      />

      {/* Main — does NOT scroll, it's a fixed layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <Topbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} sidebarCollapsed={sidebarCollapsed} />

        {/* Chat area — also does NOT overflow-scroll, only the message list does */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>
              <EmptyState onAction={q => handleExecute(q, [])} />
            </div>
          ) : (
            <div
              ref={scrollRef}
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

        <Composer onExecute={handleExecute} isExecuting={isExecuting} />
      </div>
    </div>
  );
}
