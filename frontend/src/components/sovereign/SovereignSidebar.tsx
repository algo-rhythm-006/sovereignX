import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { 
  ScanSearch, FileCheck, Terminal, 
  Search, Folder, Lock, Database, GitBranch,
  ChevronLeft, ChevronRight, LogOut, Settings, Plus, User, FileText, Cpu
} from "lucide-react";
import { MOCK_KNOWLEDGE_BASE, MOCK_HISTORY, MOCK_ARTIFACTS } from "./mockWorkspaceData";
import { UserProfileData } from "./types";
import { LiquidButton } from "@/components/ui/liquid-glass-card";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  user: UserProfileData | null;
  onLogout: () => void;
  onNewExecution: () => void;
}

export function SovereignSidebar({ collapsed, setCollapsed, user, onLogout, onNewExecution }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.to(sidebarRef.current, {
        width: collapsed ? 72 : 320,
        duration: 0.5,
        ease: "power3.inOut"
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        opacity: collapsed ? 0 : 1,
        duration: 0.3,
        delay: collapsed ? 0 : 0.2,
        display: collapsed ? "none" : "block",
        ease: "power2.out"
      });
    }
  }, [collapsed]);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div 
      ref={sidebarRef} 
      className={`h-full flex flex-col bg-[#000000] border-r border-[#151515] overflow-hidden relative z-50 shrink-0 absolute md:relative ${collapsed ? 'max-md:hidden' : 'max-md:w-full max-md:absolute max-md:inset-y-0 max-md:left-0'}`}
      style={{ width: 320 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2 shrink-0">
        <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
          <div className="w-8 h-8 rounded-lg bg-[#111] flex items-center justify-center border border-[#333] shadow-[0_0_10px_rgba(255,255,255,0.05)] shrink-0">
            <ScanSearch className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col whitespace-nowrap" style={{ opacity: collapsed ? 0 : 1, display: collapsed ? 'none' : 'flex' }}>
            <span className="font-semibold text-sm text-gray-200 flex items-center gap-2">SovereignX <span className="text-[10px] bg-[#222] text-gray-400 px-1.5 py-0.5 rounded-sm">v2</span></span>
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button 
        onClick={toggleSidebar}
        className="absolute top-4 right-[-12px] md:right-[-12px] max-md:right-4 w-6 h-6 max-md:w-8 max-md:h-8 bg-[#111] border border-[#333] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors z-50"
        style={{ transform: collapsed ? 'translateX(-12px)' : 'translateX(0)' }}
      >
        {collapsed ? <ChevronRight className="w-3 h-3 max-md:w-4 max-md:h-4" /> : <ChevronLeft className="w-3 h-3 max-md:w-4 max-md:h-4" />}
      </button>

      {/* Collapsed view icons only */}
      <div className="flex-1 flex flex-col py-4 gap-6 items-center" style={{ display: collapsed ? 'flex' : 'none' }}>
        <button onClick={onNewExecution} className="w-10 h-10 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30" title="New Execution">
          <Plus className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-white flex items-center justify-center" title="Search">
          <Search className="w-5 h-5" />
        </button>
        <div className="w-6 h-[1px] bg-[#1E293B]" />
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-cyan-400 flex items-center justify-center" title="Audit System Architecture">
          <ScanSearch className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-cyan-400 flex items-center justify-center" title="Extract Compliance">
          <FileCheck className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-cyan-400 flex items-center justify-center" title="Execute Sandbox">
          <Terminal className="w-5 h-5" />
        </button>
        <div className="w-6 h-[1px] bg-[#1E293B]" />
        <button className="w-10 h-10 rounded-lg text-gray-400 hover:text-white flex items-center justify-center" title="Knowledge Base">
          <Database className="w-5 h-5" />
        </button>
      </div>

      {/* Expanded Content */}
      <div ref={contentRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col pb-20">
        
        {/* Tabs similar to Framer */}
        <div className="px-4 py-3 border-b border-[#151515]">
          <div className="flex p-1 bg-[#111] rounded-full">
            <button className="flex-1 px-3 py-1.5 bg-[#222] text-white text-xs font-medium rounded-full shadow-sm">Workspace</button>
            <button className="flex-1 px-3 py-1.5 text-gray-500 hover:text-gray-300 text-xs font-medium rounded-full">Data</button>
            <button className="flex-1 px-3 py-1.5 text-gray-500 hover:text-gray-300 text-xs font-medium rounded-full">Rules</button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={onNewExecution} className="flex items-center gap-2 px-3 py-1.5 rounded bg-transparent hover:bg-[#111] text-gray-300 transition-colors group border border-transparent hover:border-[#333]">
              <Plus className="w-4 h-4 text-cyan-500 drop-shadow-[0_0_8px_rgba(0,163,255,0.8)] group-hover:scale-110 transition-transform" />
            </button>
            <button className="flex-1 flex items-center justify-between px-3 py-1.5 rounded bg-[#111] border border-[#222] text-gray-400 hover:text-white transition-colors group">
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span className="text-sm">Search</span>
              </div>
              <span className="text-[10px] font-mono opacity-50">⌘K</span>
            </button>
          </div>

          {/* Quick Actions (Collapsible style) */}
          <div>
            <div className="flex items-center gap-2 mb-1 px-2 text-gray-400">
              <ChevronRight className="w-3 h-3" />
              <Folder className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">Workflows</span>
            </div>
            <div className="ml-6 border-l border-[#222] space-y-0.5">
              <button className="w-full flex items-center justify-between px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#111] transition-colors rounded-r-md group">
                <div className="flex items-center gap-2">
                  <ScanSearch className="w-3.5 h-3.5 text-cyan-500/50 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
                  <span className="text-sm">Audit System Architecture</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#111] transition-colors rounded-r-md group">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-500/50 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
                  <span className="text-sm">Extract Compliance</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#111] transition-colors rounded-r-md group">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-cyan-500/50 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
                  <span className="text-sm">Execute Sandbox</span>
                </div>
              </button>
            </div>
          </div>

          {/* Knowledge Base */}
          <div>
            <div className="flex items-center justify-between px-2 text-gray-300 bg-[#111]/50 py-1.5 rounded-md mb-1 cursor-pointer">
              <div className="flex items-center gap-2">
                <ChevronRight className="w-3 h-3 rotate-90" />
                <Database className="w-3.5 h-3.5" />
                <span className="text-sm font-medium">Knowledge Base</span>
              </div>
              <span className="text-xs text-gray-500 font-mono">{MOCK_KNOWLEDGE_BASE.length}</span>
            </div>
            <div className="ml-6 border-l border-[#222] space-y-0.5">
              {MOCK_KNOWLEDGE_BASE.map((file, i) => (
                <div key={file.id} className={`group flex flex-col px-3 py-1.5 rounded-r-md cursor-pointer ${i === 0 ? 'bg-[#003366]/30 border border-[#0066FF]/30 shadow-[inset_0_0_10px_rgba(0,102,255,0.1)]' : 'hover:bg-[#111] transition-colors'}`}>
                  <div className="flex items-center gap-2">
                    <FileText className={`w-3.5 h-3.5 ${i === 0 ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(0,163,255,0.8)]' : 'text-gray-500 group-hover:text-cyan-400'}`} />
                    <span className={`text-sm truncate ${i === 0 ? 'text-cyan-100 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>{file.filename}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div>
            <div className="flex items-center gap-2 mb-1 px-2 text-gray-400">
              <ChevronRight className="w-3 h-3 rotate-90" />
              <Folder className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">History</span>
            </div>
            <div className="ml-6 border-l border-[#222] space-y-3 pt-1">
              {['Today', 'Yesterday', 'Older'].map(group => (
                <div key={group} className="space-y-0.5">
                  <div className="text-[9px] text-gray-600 px-3 uppercase tracking-wider mb-1">{group}</div>
                  {MOCK_HISTORY.filter(h => h.date === group).map(h => (
                    <button key={h.id} className="w-full flex items-center gap-2 text-left px-3 py-1 rounded-r-md text-sm text-gray-400 hover:text-white hover:bg-[#111] transition-colors truncate">
                      <div className="w-1 h-1 bg-gray-600 rounded-full shrink-0"></div>
                      <span className="truncate">{h.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Governance */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">Governance</h3>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Audit Trail</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Folder className="w-4 h-4" />
              <span className="text-sm">Governance Artifacts</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <GitBranch className="w-4 h-4" />
              <span className="text-sm">Provenance</span>
            </button>
          </div>
        </div>

      </div>

      {/* User Profile / Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#000000] border-t border-[#151515] flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-[#111] border border-[#333] flex items-center justify-center shrink-0">
          <User className="w-4 h-4 text-cyan-400" />
        </div>
        {!collapsed && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <span className="text-sm text-white font-medium truncate">{user?.name || "Authenticated User"}</span>
            <span className="text-[10px] text-gray-500 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {user?.status || "Authenticated"}
            </span>
          </div>
        )}
        {!collapsed && (
          <div className="flex items-center gap-1 shrink-0">
            <button className="p-1.5 text-gray-500 hover:text-white rounded-md hover:bg-white/10 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onLogout} className="p-1.5 text-gray-500 hover:text-red-400 rounded-md hover:bg-white/10 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #111;
          border-radius: 4px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #333;
        }
      `}</style>
    </div>
  );
}
