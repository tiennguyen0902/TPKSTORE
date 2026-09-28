import React, { useState } from "react";
import { 
  Cpu, 
  Sparkles, 
  Plus, 
  Download, 
  Trash2, 
  Layers, 
  ShieldCheck, 
  Key, 
  FileCode, 
  CheckCircle2, 
  Lock,
  ArrowRight,
  Server,
  Database,
  AlertTriangle
} from "lucide-react";
import { api } from "../services/api";

export const ArchitectureStudio: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    "canvas" | "openapi" | "jwt" | "oauth2" | "rbac"
  >("canvas");

  const [components, setComponents] = useState([
    {
      id: "node_frontend",
      name: "Web Storefront (Next.js / React)",
      type: "client",
      layer: "Presentation Layer",
      description: "Giao diện khách hàng & Admin Dashboard, TailwindCSS, Dark Mode Glassmorphism",
      status: "active"
    },
    {
      id: "node_nginx",
      name: "Nginx Reverse Proxy / Gateway",
      type: "gateway",
      layer: "Presentation Layer",
      description: "Cân bằng tải, SSL Termination, Port 80/443 điều phối lưu lượng",
      status: "active"
    },
    {
      id: "node_backend",
      name: "Core Backend (Express/TS)",
      type: "service",
      layer: "Application Layer",
      description: "8 Modules nghiệp vụ, JWT, RBAC, REST API, Atomic Transactions",
      status: "active"
    },
    {
      id: "node_postgres",
      name: "PostgreSQL 15 (Prisma ORM)",
      type: "database",
      layer: "Repository Layer",
      description: "CSDL quan hệ ACID, Full-Text Search, 10 bảng dữ liệu chuẩn",
      status: "active"
    },
    {
      id: "node_redis",
      name: "Redis Cache & Store",
      type: "database",
      layer: "Infrastructure Layer",
      description: "Product Caching, Token Blacklist, Rate Limiting",
      status: "active"
    },
    {
      id: "node_ai",
      name: "AI Microservices (FastAPI)",
      type: "service",
      layer: "Infrastructure Layer",
      description: "Hybrid Recommendation, RAG Chatbot, Prophet/ARIMA Forecasting",
      status: "active"
    }
  ]);

  const [selectedComponentId, setSelectedComponentId] = useState<string>("node_backend");
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // New component form
  const [newCompName, setNewCompName] = useState("");
  const [newCompLayer, setNewCompLayer] = useState("Application Layer");
  const [newCompDesc, setNewCompDesc] = useState("");
  const [compNameError, setCompNameError] = useState("");

  const selectedComponent = components.find(c => c.id === selectedComponentId) || components[0];

  const handleAskAi = async () => {
    setIsAnalyzing(true);
    try {
      const res = await api.analyzeArchitecture(components, []);
      setAiAnalysisResult(res);
    } catch (err) {
      console.warn("AI analysis failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(components, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "architecture_specification.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAddComponent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompName.trim()) {
      setCompNameError("Vui lòng nhập tên thành phần kiến trúc.");
      return;
    }
    setCompNameError("");
    const newId = `node_${Date.now()}`;
    setComponents(prev => [
      ...prev,
      {
        id: newId,
        name: newCompName.trim(),
        type: "service",
        layer: newCompLayer as any,
        description: newCompDesc.trim() || "Thành phần mở rộng hệ thống",
        status: "active"
      }
    ]);
    setSelectedComponentId(newId);
    setShowAddModal(false);
    setNewCompName("");
    setNewCompDesc("");
    setCompNameError("");
  };

  const handleDeleteComponent = (id: string) => {
    if (components.length <= 1) return;
    setComponents(prev => prev.filter(c => c.id !== id));
    if (selectedComponentId === id) {
      setSelectedComponentId(components[0].id);
    }
  };

  const layersList = [
    "Presentation Layer",
    "Application Layer",
    "Domain Layer",
    "Repository Layer",
    "Infrastructure Layer"
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner (Matching Screenshot) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>SOFTWARE ARCHITECTURE & SECURITY DESIGN STUDIO</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            Architecture Designer & AI Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thiết kế, kiểm tra, phân tích và tối ưu hóa kiến trúc Layered Architecture & Microservices
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleAskAi}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "AI đang phân tích..." : "Ask AI: Analyze Architecture"}</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Component</span>
          </button>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Selector (Matching Screenshot!) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: "canvas", label: "Architecture Canvas" },
          { id: "openapi", label: "RESTful API & OpenAPI Studio" },
          { id: "jwt", label: "JWT & Token Rotation Designer" },
          { id: "oauth2", label: "OAuth2 with PKCE Studio" },
          { id: "rbac", label: "RBAC Permission Matrix" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all font-semibold ${
              activeSubTab === tab.id
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-800 hover:bg-slate-700 text-white hover:text-white shadow-sm"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* AI Analysis Result Panel (if generated) */}
      {aiAnalysisResult && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950/60 via-[#131c2e] to-rose-800/60 border border-rose-500/40 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Kết Quả Đánh Giá Kiến Trúc Từ AI</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
              Điểm số: {aiAnalysisResult.score}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <p className="font-bold text-rose-300 uppercase tracking-wider">Điểm mạnh kiến trúc:</p>
              <ul className="space-y-1.5 text-slate-200">
                {aiAnalysisResult.analysis?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-amber-300 uppercase tracking-wider">Khuyến nghị tối ưu hóa:</p>
              <ul className="space-y-1.5 text-slate-200">
                {aiAnalysisResult.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">→</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: ARCHITECTURE CANVAS (Matching Screenshot!) */}
      {activeSubTab === "canvas" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 5-Tier Layered Interactive Canvas */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                LAYERED ARCHITECTURE INTERACTIVE CANVAS (5 TẦNG)
              </h3>
              <span className="text-[11px] text-slate-500">
                {components.length} Components | 5 Connections
              </span>
            </div>

            {/* 5 Layer Containers */}
            <div className="space-y-4">
              {layersList.map((layerName) => {
                const layerComponents = components.filter(c => c.layer === layerName);

                return (
                  <div key={layerName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <span>{layerName}</span>
                      <span className="text-[10px] text-slate-500">{layerComponents.length} components</span>
                    </div>

                    {layerComponents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {layerComponents.map((comp) => {
                          const isSelected = selectedComponentId === comp.id;
                          return (
                            <div
                              key={comp.id}
                              onClick={() => setSelectedComponentId(comp.id)}
                              className={`p-3.5 rounded-xl cursor-pointer transition-all ${
                                isSelected
                                  ? "bg-rose-200 border-2 border-rose-600 shadow-md shadow-rose-600/20"
                                  : "bg-white border border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className={`text-xs truncate ${isSelected ? "font-extrabold text-black" : "font-bold text-slate-900"}`}>
                                  {comp.name}
                                </span>
                                <span className={`w-2.5 h-2.5 rounded-full ${isSelected ? "bg-emerald-600 ring-2 ring-white shrink-0" : "bg-emerald-400 shrink-0"}`} />
                              </div>
                              <p className={`text-[11px] line-clamp-1 ${isSelected ? "text-black font-semibold" : "text-slate-500"}`}>
                                {comp.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-500 italic bg-slate-50/40 rounded-xl border border-dashed border-slate-200">
                        Chưa có component ở tầng này (Có thể bổ sung qua nút Thêm Component)
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Component Connections & Protocols (Matching Screenshot!) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <h4 className="font-bold text-slate-700 uppercase text-[11px] tracking-wider">
                COMPONENT CONNECTIONS & PROTOCOLS
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-cyan-400">node_frontend</span>
                  <span>── [HTTPS / JSON] ──&gt;</span>
                  <span className="text-emerald-400">node_nginx</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-emerald-400">node_nginx</span>
                  <span>── [Proxy Pass :5000] ──&gt;</span>
                  <span className="text-rose-400">node_backend</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-rose-400">node_backend</span>
                  <span>── [Prisma Client] ──&gt;</span>
                  <span className="text-emerald-400">node_postgres</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-rose-400">node_backend</span>
                  <span>── [ioredis :6379] ──&gt;</span>
                  <span className="text-red-400">node_redis</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-rose-400">node_backend</span>
                  <span>── [Internal REST / JSON] ──&gt;</span>
                  <span className="text-rose-400">node_ai</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Component Inspector (Matching Screenshot!) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xl sticky top-24 self-start">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Component Inspector
              </h3>
              <button
                onClick={() => handleDeleteComponent(selectedComponent.id)}
                title="Xóa component"
                className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-500 font-mono text-[11px]">ID:</label>
                <p className="font-mono text-cyan-600 font-bold">{selectedComponent.id}</p>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px]">Tên component:</label>
                <p className="font-bold text-slate-900 text-sm">{selectedComponent.name}</p>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px]">Phân loại (Type):</label>
                <span className="inline-block px-3 py-1 rounded-lg bg-rose-700 text-white font-mono font-bold text-xs mt-1 shadow-sm">
                  {selectedComponent.type}
                </span>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px]">Tầng (Layer):</label>
                <p className="font-bold text-emerald-600">{selectedComponent.layer}</p>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px]">Mô tả chi tiết:</label>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 mt-1">
                  {selectedComponent.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPENAPI STUDIO */}
      {activeSubTab === "openapi" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <FileCode className="w-5 h-5 text-rose-400" />
            RESTful API Specification & Swagger Documentation
          </h3>
          <p className="text-slate-500">
            Đặc tả toàn bộ 25+ endpoints chuẩn OpenAPI 3.0 cho Core Backend và AI Microservices.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-mono font-bold shadow-sm">POST /api/auth/login</span>
              <p className="text-slate-700">Đăng nhập cấp Access Token (15m) & Refresh Token (7d).</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono font-bold shadow-sm">POST /api/orders</span>
              <p className="text-slate-700">Tạo đơn hàng Atomic Transaction và trừ tồn kho tức thì.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-mono font-bold shadow-sm">POST /api/ai/chat</span>
              <p className="text-slate-700">RAG Chatbot truy vấn tri thức và trả kèm Product Cards.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-mono font-bold shadow-sm">POST /api/ai/forecast</span>
              <p className="text-slate-700">Dự báo chuỗi thời gian Hybrid Prophet-ARIMA 30 ngày.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JWT & TOKEN ROTATION DESIGNER */}
      {activeSubTab === "jwt" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            JWT Access Token & Refresh Token Rotation
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-slate-700 leading-relaxed font-mono">
            <p className="text-rose-400 font-bold">1. Client gửi Access Token (15 phút) trong Authorization Header.</p>
            <p className="text-blue-400 font-bold">2. Khi Access Token hết hạn, Client gửi Refresh Token (7 ngày) qua `/api/auth/refresh-token`.</p>
            <p className="text-emerald-400 font-bold">3. Backend kiểm tra SHA-256 Hash trong DB và Redis Blacklist.</p>
            <p className="text-pink-400 font-bold">4. Thu hồi Refresh Token cũ, cấp cặp Access Token & Refresh Token mới (Rotation).</p>
          </div>
        </div>
      )}

      {/* TAB 4: OAUTH2 PKCE STUDIO */}
      {activeSubTab === "oauth2" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Lock className="w-5 h-5 text-cyan-400" />
            OAuth2 with PKCE Security Studio
          </h3>
          <p className="text-slate-700 leading-relaxed">
            Hỗ trợ cơ chế Code Challenge (SHA256) & Code Verifier bảo vệ ứng dụng SPA Single Page Application chống lại tấn công chặn bắt Authorization Code.
          </p>
        </div>
      )}

      {/* TAB 5: RBAC PERMISSION MATRIX */}
      {activeSubTab === "rbac" && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xl text-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Role-Based Access Control (RBAC) Permission Matrix
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="p-3">Tính Năng / API Route</th>
                  <th className="p-3 text-center">CUSTOMER</th>
                  <th className="p-3 text-center">STAFF</th>
                  <th className="p-3 text-center">ADMIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-700">
                <tr>
                  <td className="p-3">Xem & Tìm kiếm sản phẩm, Giỏ hàng, Đặt hàng</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-3">Chat với RAG AI Assistant, Nhận gợi ý sản phẩm</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-3">Xử lý & Cập nhật trạng thái đơn hàng (Order State Machine)</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-3">Quản lý tồn kho & Xem cảnh báo cạn kho thông minh</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-3">Xem Dự Báo Doanh Thu AI (Prophet/ARIMA) & Architecture Studio</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-3">Phân quyền User & Cấu hình Google Gemini Key, VNPAY Code</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-slate-600 font-bold">✗</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-300 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Thêm Component Vào Kiến Trúc</h3>
            <form noValidate onSubmit={handleAddComponent} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên Component <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Redis Queue / Payment Gateway"
                  value={newCompName}
                  onChange={(e) => { setNewCompName(e.target.value); setCompNameError(""); }}
                  className={`w-full bg-slate-50 border rounded-xl px-3 py-2 text-slate-900 focus:outline-none text-xs transition-colors ${
                    compNameError 
                      ? "border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20" 
                      : "border-slate-300 focus:border-rose-500"
                  }`}
                />
                {compNameError && (
                  <p className="mt-1 text-[11px] text-rose-600 flex items-center gap-1 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{compNameError}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tầng Phân Lớp (Layer)</label>
                <select
                  value={newCompLayer}
                  onChange={(e) => setNewCompLayer(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 text-xs"
                >
                  {layersList.map((l) => (
                    <option key={l} value={l} className="bg-white">{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả chức năng</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả trách nhiệm của thành phần..."
                  value={newCompDesc}
                  onChange={(e) => setNewCompDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-rose-500 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold border border-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-md shadow-rose-600/30"
                >
                  Thêm Component
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
