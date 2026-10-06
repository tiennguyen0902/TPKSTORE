"""
SHOPBEE / STORE AI - AI Microservice
FastAPI Application providing Recommendation, RAG Chatbot, Forecasting & Inventory Analytics

Version: 2.2.0
"""

import os
import re
import logging
import requests
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from knowledge_base import POLICIES
from recommender import remove_accents, parse_budget, get_hybrid_recommendations
from forecaster import generate_sales_forecast
from inventory_analyzer import analyze_inventory

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

# ---------------------------------------------------------------------------
# App Initialization
# ---------------------------------------------------------------------------
app = FastAPI(title="STORE AI Microservice", version="2.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
DEFAULT_GEMINI_MODEL = "gemini-3.5-flash"

def is_gemini_3x(name: str) -> bool:
    if not name:
        return False
    clean = name.lower().replace("models/", "").strip()
    return clean.startswith("gemini-3")

GEMINI_CANDIDATE_MODELS = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-3.0-pro",
    "gemini-3.5-pro",
]

# ---------------------------------------------------------------------------
# Request / Response Models
# ---------------------------------------------------------------------------

class RecommendRequest(BaseModel):
    products: List[Dict[str, Any]]
    targetProductId: Optional[str] = None
    userPurchasedIds: Optional[List[str]] = None
    categoryId: Optional[str] = None
    limit: Optional[int] = 4


class ChatMessage(BaseModel):
    role: str  # user | assistant | system
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    products: Optional[List[Dict[str, Any]]] = []
    provider: Optional[str] = "gemini"
    geminiApiKey: Optional[str] = None
    geminiModel: Optional[str] = DEFAULT_GEMINI_MODEL


class TestKeyRequest(BaseModel):
    provider: Optional[str] = "gemini"
    apiKey: Optional[str] = None
    model: Optional[str] = None
    geminiApiKey: Optional[str] = None
    geminiModel: Optional[str] = DEFAULT_GEMINI_MODEL


class InventoryRequest(BaseModel):
    products: List[Dict[str, Any]]


class ArchitectureAnalysisRequest(BaseModel):
    components: List[Dict[str, Any]]
    connections: Optional[List[Dict[str, Any]]] = []


# ---------------------------------------------------------------------------
# Private Helpers
# ---------------------------------------------------------------------------

def _dedupe_models(preferred: Optional[str], candidates: List[str], strip_prefix: str = "") -> List[str]:
    """
    Return a deduplicated list of model names, with `preferred` first.
    Strips an optional prefix (e.g. 'models/') from each name.
    """
    seen: List[str] = []
    raw = [preferred] + candidates if preferred else candidates
    for m in raw:
        if not m:
            continue
        clean = m.replace(strip_prefix, "").strip() if strip_prefix else m.strip()
        if clean and clean not in seen:
            seen.append(clean)
    return seen


def _build_context_prompt(
    matched_policies: list,
    matched_products: list,
    is_external_query: bool,
) -> str:
    """
    Build the system/context prompt for the LLM based on RAG results.
    """
    ctx = (
        "Bạn là Trợ lý AI Thông minh & Đa năng của SHOPBEE (STORE AI) - "
        "Nền tảng thương mại điện tử công nghệ cao.\n"
        "Quy tắc chỉ dẫn:\n"
        "1. Luôn trả lời lịch sự, thân thiện, súc tích bằng tiếng Việt có định dạng Markdown đẹp mắt.\n"
    )

    if matched_policies or matched_products:
        ctx += (
            "2. Với câu hỏi về sản phẩm/chính sách: Hãy ưu tiên sử dụng thông tin CSDL "
            "và chính sách của cửa hàng dưới đây để trả lời chính xác.\n"
        )
    else:
        ctx += (
            "2. Với câu hỏi ngoài CSDL cửa hàng (kiến thức tổng quát, khoa học, kỹ thuật, "
            "so sánh công nghệ, đời sống, lập trình, toán học, tư vấn chuyên sâu, v.v.): "
            "Bạn hãy tận dụng toàn bộ kiến thức sâu rộng của LLM để giải đáp thật chi tiết, "
            "khách quan, hữu ích và truyền cảm hứng cho người dùng.\n"
        )

    ctx += (
        "3. Nếu phù hợp và tự nhiên, bạn có thể gợi ý các thiết bị công nghệ "
        "hoặc sản phẩm liên quan của SHOPBEE.\n"
        "4. BẢO MẬT & LOẠI TRỪ NỘI DUNG NHẠY CẢM: Tuyệt đối không cung cấp, tạo hoặc hỗ trợ "
        "các nội dung 18+, khiêu dâm, bạo lực, ma túy, cờ bạc lừa đảo, tấn công mạng, chính trị cực đoan. "
        "Không bao giờ tiết lộ API Key, Database URL, mật khẩu hoặc dữ liệu khách hàng.\n\n"
    )

    if matched_policies:
        ctx += "CHÍNH SÁCH CỬA HÀNG:\n"
        for pol in matched_policies:
            ctx += f"[{pol['title']}]: {pol['content']}\n"

    if matched_products:
        ctx += "\nSẢN PHẨM PHÙ HỢP CÓ SẴN TRONG CƠ SỞ DỮ LIỆU CỬA HÀNG:\n"
        for p in matched_products:
            ctx += (
                f"- {p.get('name')}: Giá {p.get('price'):,.0f} VND "
                f"(Tồn kho: {p.get('stock')}) - {p.get('description')}\n"
            )

    return ctx





def _call_gemini(
    api_key: str,
    model: str,
    prompt: str,
    timeout: int = 18,
) -> Optional[str]:
    """
    Call Google Gemini generateContent API. Returns the reply text or None on failure.
    """
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.6,
            "maxOutputTokens": 8192,
        },
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_LOW_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ],
    }
    try:
        resp = requests.post(url, json=payload, timeout=timeout)
        if resp.status_code == 200:
            candidate = resp.json().get("candidates", [{}])[0]
            if candidate.get("finishReason") == "SAFETY":
                return "Dạ xin lỗi bạn, câu hỏi này chứa nội dung nằm ngoài phạm vi an toàn cho phép theo chính sách cộng đồng. Tôi luôn sẵn sàng hỗ trợ bạn về kiến thức công nghệ, đời sống và các sản phẩm của SHOPBEE!"
            parts = candidate.get("content", {}).get("parts", [])
            text_parts = [p.get("text", "") for p in parts if "text" in p]
            if text_parts:
                raw_text = "".join(text_parts).strip()
                # Sanitize secret keys
                raw_text = re.sub(r"AQ\.[A-Za-z0-9_-]{30,}", "[BẢO MẬT API KEY]", raw_text)
                raw_text = re.sub(r"postgresql://\S+", "[BẢO MẬT DATABASE_URL]", raw_text)
                return raw_text
        logger.warning(f"Gemini model {model} returned {resp.status_code}: {resp.text[:120]}")
    except Exception as exc:
        logger.warning(f"Error calling Gemini model {model}: {exc}")
    return None


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "STORE AI Microservices",
        "version": "2.2.0",
        "supportedProviders": ["Google Gemini (3.x+)", "Local AI Engine"],
    }


@app.post("/api/ai/test-key")
def test_ai_api_key(req: TestKeyRequest):
    """Kiểm tra tính hợp lệ và khả năng kết nối của Google Gemini API Key (3.x+)."""
    api_key = (req.apiKey or req.geminiApiKey or "").strip() or os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {
            "status": "error",
            "valid": False,
            "provider": "gemini",
            "message": "Chưa có Google Gemini API Key. Vui lòng nhập mã API Key để kiểm tra.",
        }

    # Step A: Validate key via ListModels (Chỉ lấy model 3.x trở lên)
    available_gemini_models: List[str] = []
    try:
        r_list = requests.get(
            f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}",
            timeout=8,
        )
        if r_list.status_code in (400, 401, 403):
            err_data = {}
            try:
                err_data = r_list.json().get("error", {})
            except Exception:
                pass
            msg = err_data.get("message", "API Key không chính xác hoặc bị từ chối truy cập.")
            return {
                "status": "error",
                "valid": False,
                "provider": "gemini",
                "message": f"Google từ chối ({r_list.status_code}): {msg}",
            }
        elif r_list.status_code == 200:
            raw_models = r_list.json().get("models", [])
            available_gemini_models = [
                m.get("name", "").replace("models/", "").strip()
                for m in raw_models
                if "generateContent" in m.get("supportedGenerationMethods", [])
                and is_gemini_3x(m.get("name", ""))
            ]
    except Exception as exc:
        logger.warning(f"Error querying Gemini models: {exc}")

    target_model = req.model or req.geminiModel or DEFAULT_GEMINI_MODEL
    if not is_gemini_3x(target_model):
        target_model = DEFAULT_GEMINI_MODEL

    raw_candidates = [target_model] + available_gemini_models + GEMINI_CANDIDATE_MODELS
    unique_models = [
        m for m in _dedupe_models(target_model, raw_candidates, strip_prefix="models/")
        if is_gemini_3x(m)
    ]

    test_prompt = "Xin chào! Hãy phản hồi ngắn gọn đúng 1 câu bằng tiếng Việt xác nhận kết nối Google Gemini hoạt động tốt."

    last_error = ""
    for model in unique_models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        payload = {
            "contents": [{"role": "user", "parts": [{"text": test_prompt}]}],
            "generationConfig": {"temperature": 0.2, "maxOutputTokens": 100},
        }
        try:
            resp = requests.post(url, json=payload, timeout=8)
            if resp.status_code == 200:
                sample_reply = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                logger.info(f"Gemini Test Success — model: {model} (requested: {target_model})")
                return {
                    "status": "success",
                    "valid": True,
                    "provider": "gemini",
                    "model": model,
                    "message": f"Google Gemini API Key hoạt động chính xác! Kết nối thành công ({model}).",
                    "sampleResponse": sample_reply,
                    "availableModels": (available_gemini_models or GEMINI_CANDIDATE_MODELS)[:15],
                }
            elif resp.status_code in (400, 401, 403):
                err_data = {}
                try:
                    err_data = resp.json().get("error", {})
                except Exception:
                    pass
                msg = err_data.get("message", "API Key không hợp lệ hoặc không có quyền truy cập.")
                return {
                    "status": "error",
                    "valid": False,
                    "provider": "gemini",
                    "message": f"Google từ chối ({resp.status_code}): {msg}",
                }
            elif resp.status_code == 429:
                return {
                    "status": "warning",
                    "valid": True,
                    "provider": "gemini",
                    "model": model,
                    "message": "Google Gemini Quota (429): Đã vượt quá hạn mức sử dụng (Rate limit / Quota exceeded). Vui lòng thử lại sau.",
                    "availableModels": (available_gemini_models or GEMINI_CANDIDATE_MODELS)[:15],
                }
            elif resp.status_code == 404:
                continue
            else:
                last_error = f"Mã lỗi HTTP {resp.status_code}: {resp.text[:120]}"
        except Exception as exc:
            last_error = f"Lỗi kết nối Google: {str(exc)}"

    if available_gemini_models:
        return {
            "status": "success",
            "valid": True,
            "provider": "gemini",
            "model": available_gemini_models[0],
            "message": f"Google Gemini API Key hoàn toàn chính xác! Đã xác thực thành công danh mục mô hình Google AI Studio (Model khả dụng: {available_gemini_models[0]}).",
            "availableModels": available_gemini_models[:15],
        }

    return {
        "status": "error",
        "valid": False,
        "provider": "gemini",
        "message": f"Kiểm tra Google Gemini thất bại: {last_error or 'Không thể kết nối đến máy chủ Google AI Studio.'}",
    }


@app.post("/api/ai/recommend")
def recommend_products(req: RecommendRequest):
    try:
        recommendations = get_hybrid_recommendations(
            all_products=req.products,
            target_product_id=req.targetProductId,
            user_purchased_ids=req.userPurchasedIds,
            category_id=req.categoryId,
            limit=req.limit or 4,
        )
        return {
            "status": "success",
            "count": len(recommendations),
            "recommendations": recommendations,
            "engine": "Hybrid-Collaborative-Content-Based-v2.2",
        }
    except Exception as exc:
        logger.error(f"Recommendation error: {exc}")
        fallback = req.products[: (req.limit or 4)]
        return {
            "status": "fallback",
            "count": len(fallback),
            "recommendations": fallback,
            "engine": "Fallback-BestSellers",
        }


@app.post("/api/ai/chat")
def rag_chat(req: ChatRequest):
    query = req.message.strip()
    norm_query = remove_accents(query)
    provider = (req.provider or "gemini").lower().strip()

    # ── 0. Pre-filter prohibited / sensitive content ─────────────────────── #
    prohibited_pattern = re.compile(
        r"(khiêu\s*dâm|phim\s*sex|đồi\s*trụy|gái\s*gọi|ấu\s*dâm|loạn\s*luân|chế\s*tạo\s*bom|thuốc\s*nổ|tự\s*tử|tự\s*sát|tự\s*hại|ma\s*túy|thuốc\s*lắc|đánh\s*bạc|hack\s*tài\s*khoản|chống\s*phá\s*nhà\s*nước|khủng\s*bố|reveal\s*api\s*key|mật\s*khẩu\s*database)",
        re.IGNORECASE
    )
    if prohibited_pattern.search(query):
        return {
            "reply": "Dạ xin lỗi bạn, câu hỏi của bạn chứa nội dung nằm ngoài phạm vi an toàn cho phép theo chính sách cộng đồng. Tôi luôn sẵn sàng giải đáp các thắc mắc về công nghệ, đời sống và sản phẩm của SHOPBEE!",
            "suggestedProducts": [],
            "suggestedQuickReplies": ["Tư vấn Laptop AI", "Tai nghe chống ồn", "Chính sách bảo hành"],
            "source": "SHOPBEE AI",
            "provider": "gemini",
            "model": req.geminiModel or DEFAULT_GEMINI_MODEL,
            "isExternalQuery": False,
            "disclaimer": "ℹ️ Yêu cầu được lọc theo chính sách an toàn thông tin."
        }

    # ── 1. Parse budget constraints ───────────────────────────────────────── #
    budget = parse_budget(query)
    min_p = budget.get("min_price")
    max_p = budget.get("max_price")

    # ── 2. Match knowledge-base policies ─────────────────────────────────── #
    matched_policies = [
        p_val
        for p_val in POLICIES.values()
        if any(kw in norm_query for kw in p_val["keywords"])
    ]

    # ── 3. Match relevant products ────────────────────────────────────────── #
    matched_products = []
    if req.products:
        scored: List[tuple] = []
        COMMON_STOPWORDS = {
            "ban", "co", "biet", "khong", "cho", "toi", "minh", "nay", "duoc",
            "khach", "muon", "hoi", "ve", "gi", "sao", "the", "nao", "o", "dau",
            "va", "la", "cac", "nhung", "mot", "hai", "hay", "xin", "chao", "voi",
            "ai", "dang", "rat", "nhe", "a", "da", "di", "nhu", "giup", "admin"
        }
        query_words = [w for w in norm_query.split() if len(w) > 2 and w not in COMMON_STOPWORDS]

        for p in req.products:
            p_norm = remove_accents(f"{p.get('name', '')} {p.get('description', '')}")
            price = float(p.get("price", 0))

            budget_ok = (min_p is None or price >= min_p) and (max_p is None or price <= max_p)
            word_match = sum(1 for w in query_words if w in p_norm)

            if budget_ok and ((word_match > 0 and query_words) or (min_p is not None or max_p is not None)):
                scored.append((word_match, p))

        scored.sort(key=lambda x: x[0], reverse=True)
        if query_words or min_p is not None or max_p is not None:
            matched_products = [item[1] for item in scored[:3] if item[0] > 0 or min_p is not None or max_p is not None]

    is_external_query = not matched_products and not matched_policies

    # ── 4. Build context prompt ───────────────────────────────────────────── #
    context_text = _build_context_prompt(matched_policies, matched_products, is_external_query)

    quick_replies = ["Xem sản phẩm nổi bật", "Chính sách bảo hành 1 đổi 1", "Giao hàng hỏa tốc 2h"]
    if is_external_query:
        quick_replies = ["Tư vấn chọn Laptop AI", "Tai nghe chống ồn tốt nhất", "Khuyến mãi hôm nay", "Kiểm tra đơn hàng"]

    # ── 5. Google Gemini (3.x+) ────────────────────────────────────────────── #
    gemini_key = (req.geminiApiKey or "").strip() or os.getenv("GEMINI_API_KEY", "").strip()
    if gemini_key:
        target_model = req.geminiModel or DEFAULT_GEMINI_MODEL
        if not is_gemini_3x(target_model):
            target_model = DEFAULT_GEMINI_MODEL
        raw_models = [target_model] + GEMINI_CANDIDATE_MODELS
        unique_gemini_models = [m for m in _dedupe_models(target_model, raw_models, strip_prefix="models/") if is_gemini_3x(m)]
        full_prompt = f"Chỉ dẫn hệ thống:\n{context_text}\n\nCâu hỏi của người dùng: {query}"

        for model in unique_gemini_models:
            reply_text = _call_gemini(gemini_key, model, full_prompt)
            if reply_text:
                logger.info(f"Chat response via Gemini model: {model}")
                source_label = f"Google Gemini ({target_model})"
                return {
                    "reply": reply_text,
                    "suggestedProducts": matched_products,
                    "suggestedQuickReplies": quick_replies,
                    "source": source_label,
                    "provider": "gemini",
                    "model": target_model,
                    "isExternalQuery": is_external_query,
                    "disclaimer": "✨ Câu trả lời được tạo bởi Google Gemini AI (3.x+). Thông tin sản phẩm có thể thay đổi tùy thời điểm.",
                }

    # ── 6. Local Rule-Based RAG Fallback ─────────────────────────────────── #
    reply_parts = []

    if matched_policies:
        for pol in matched_policies:
            reply_parts.append(f"📌 **{pol['title']}**:\n{pol['content']}")

    if matched_products:
        p_names = ", ".join([f"**{p.get('name')}** ({p.get('price'):,.0f} đ)" for p in matched_products])
        reply_parts.append(f"✨ Dựa trên yêu cầu của bạn, SHOPBEE xin gợi ý các sản phẩm phù hợp nhất:\n{p_names}")
    elif min_p is not None or max_p is not None:
        reply_parts.append("Dạ hiện tại các sản phẩm trong khoảng giá này đang được cập nhật thêm, bạn có thể tham khảo thêm các dòng sản phẩm nổi bật tại trang chủ ạ!")
    elif not matched_policies:
        reply_parts.append(
            "Dạ chào bạn! Tôi là trợ lý AI thông minh của **SHOPBEE**. "
            "Tôi có thể hỗ trợ bạn tìm kiếm sản phẩm theo ngân sách (VD: *'tìm laptop dưới 20 triệu'*, *'tai nghe chống ồn tầm 1-2 triệu'*), "
            "hoặc giải đáp về chính sách bảo hành 1 đổi 1, giao hàng hỏa tốc 2h và đổi trả trong 7 ngày. Bạn đang quan tâm đến sản phẩm nào ạ?"
        )

    return {
        "reply": "\n\n".join(reply_parts),
        "suggestedProducts": matched_products,
        "suggestedQuickReplies": ["Tư vấn Laptop Gaming", "Tai nghe chống ồn AI", "Chính sách đổi trả 7 ngày", "Giao hàng hỏa tốc 2h"],
        "source": "Local RAG Engine (Fallback)",
        "disclaimer": "⚠️ Phản hồi do AI hỗ trợ. Quý khách vui lòng kiểm tra lại thông số và tồn kho thực tế.",
    }


@app.post("/api/ai/forecast")
def sales_forecast(days: int = 30):
    try:
        data = generate_sales_forecast(days=days)
        return {"status": "success", "data": data}
    except Exception as exc:
        logger.error(f"Forecast error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/ai/inventory-alerts")
def inventory_alerts(req: InventoryRequest):
    try:
        alerts = analyze_inventory(req.products)
        return {
            "status": "success",
            "count": len(alerts),
            "alerts": alerts,
            "engine": "AI-Smart-Safety-Stock-Analyzer",
        }
    except Exception as exc:
        logger.error(f"Inventory analysis error: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/ai/analyze-architecture")
def analyze_architecture(req: ArchitectureAnalysisRequest):
    components = req.components or []
    connections = req.connections or []
    gemini_key = (req.geminiApiKey or "").strip() or os.getenv("GEMINI_API_KEY", "").strip()

    if not components:
        return {
            "status": "unavailable",
            "message": "Không có thành phần kiến trúc nào để phân tích."
        }

    # Nếu có Gemini API Key, phân tích kiến trúc thực tế bằng AI
    if gemini_key:
        comp_summary = "\n".join([f"- [{c.get('layer', 'Component')}] {c.get('name', 'Unknown')}: {c.get('description', '')}" for c in components])
        conn_summary = "\n".join([f"- {c.get('from', '')} -> {c.get('to', '')} ({c.get('type', 'connection')})" for c in connections])
        
        prompt = f"""Bạn là Kiến trúc sư trưởng Hệ thống phần mềm (Chief Software Architect).
Hãy đánh giá sơ đồ kiến trúc hệ thống sau đây:

Các thành phần (Components):
{comp_summary}

Các liên kết (Connections):
{conn_summary}

Yêu cầu xuất ra định dạng JSON chính xác với cấu trúc:
{{
  "score": "Điểm số từ 0-100 kèm đánh giá ngắn (ví dụ: 92/100 (Solid Layered Design))",
  "analysis": ["Điểm mạnh 1", "Điểm mạnh 2", "Điểm mạnh 3"],
  "recommendations": ["Khuyến nghị tối ưu 1", "Khuyến nghị tối ưu 2"]
}}
Chỉ trả về JSON hợp lệ, không kèm văn bản markdown giải thích ngoài lề."""

        target_model = req.geminiModel or DEFAULT_GEMINI_MODEL
        if not is_gemini_3x(target_model):
            target_model = DEFAULT_GEMINI_MODEL
        raw_models = [target_model] + GEMINI_CANDIDATE_MODELS
        unique_gemini_models = [m for m in _dedupe_models(target_model, raw_models, strip_prefix="models/") if is_gemini_3x(m)]

        for model in unique_gemini_models:
            raw_reply = _call_gemini(gemini_key, model, prompt)
            if raw_reply:
                import json
                try:
                    # Tìm chuỗi json trong phản hồi
                    json_match = re.search(r"\{[\s\S]*\}", raw_reply)
                    if json_match:
                        data = json.loads(json_match.group(0))
                        return {
                            "status": "success",
                            "score": data.get("score", "Đã đánh giá bởi AI"),
                            "analysis": data.get("analysis", []),
                            "recommendations": data.get("recommendations", [])
                        }
                except Exception as e:
                    logger.warning(f"Error parsing Gemini architecture analysis JSON: {e}")

    # Tuyệt đối không tự cho score giả 98/100 khi AI offline
    return {
        "status": "unavailable",
        "message": "AI architecture analyzer is unavailable."
    }



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
