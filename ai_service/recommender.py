"""
Hybrid Product Recommendation Engine
Combines Content-Based Filtering, Collaborative User Signal & Cold-Start Fallback
"""

import re
import unicodedata
from typing import List, Dict, Any, Optional

def remove_accents(input_str: str) -> str:
    """Remove Vietnamese diacritics for robust matching"""
    if not input_str:
        return ""
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)]).replace('đ', 'd').replace('Đ', 'D').lower()

def parse_budget(text: str) -> Dict[str, Optional[float]]:
    """
    Parse budget constraints from Vietnamese natural query text.
    Handles: 'dưới 15 triệu', 'tầm 10-15tr', 'khoảng 20tr', 'dưới 500k', 'giá rẻ'
    Expansion rule: 'tầm X triệu' -> [0.7 * X, 1.3 * X]
    """
    raw = remove_accents(text)
    min_price = None
    max_price = None

    # Pattern: range like '10 - 15 trieu' or '10-15tr' or '500k - 1tr'
    range_match = re.search(r'(\d+(?:[\.,]\d+)?)\s*(?:-|den|toi)\s*(\d+(?:[\.,]\d+)?)\s*(trieu|tr|k|nghin|vnd|dong)?', raw)
    if range_match:
        val1 = float(range_match.group(1).replace(',', '.'))
        val2 = float(range_match.group(2).replace(',', '.'))
        unit = range_match.group(3) or 'trieu'
        
        mult1 = 1_000_000 if ('tr' in unit or 'trieu' in unit) else (1_000 if 'k' in unit or 'nghin' in unit else 1_000_000)
        mult2 = mult1
        min_price = min(val1, val2) * mult1
        max_price = max(val1, val2) * mult2
        return {"min_price": min_price, "max_price": max_price}

    # Pattern: 'duoi 15 trieu', '< 15tr', 'nho hon 10tr'
    under_match = re.search(r'(?:duoi|<|nho hon|it hon|khong qua|toi da)\s*(\d+(?:[\.,]\d+)?)\s*(trieu|tr|k|nghin)?', raw)
    if under_match:
        val = float(under_match.group(1).replace(',', '.'))
        unit = under_match.group(2) or ('k' if val >= 50 else 'trieu')
        mult = 1_000_000 if ('tr' in unit or 'trieu' in unit) else 1_000
        max_price = val * mult
        return {"min_price": 0, "max_price": max_price}

    # Pattern: 'tren 10 trieu', '> 10tr', 'tu 5 trieu'
    over_match = re.search(r'(?:tren|>|lon hon|tu)\s*(\d+(?:[\.,]\d+)?)\s*(trieu|tr|k|nghin)?', raw)
    if over_match:
        val = float(over_match.group(1).replace(',', '.'))
        unit = over_match.group(2) or ('k' if val >= 50 else 'trieu')
        mult = 1_000_000 if ('tr' in unit or 'trieu' in unit) else 1_000
        min_price = val * mult
        return {"min_price": min_price, "max_price": None}

    # Pattern: 'tam 15 trieu', 'khoang 10tr', 'co 20 trieu' -> [0.7 * X, 1.3 * X]
    around_match = re.search(r'(?:tam|khoang|co|co tam|muc|gia)\s*(\d+(?:[\.,]\d+)?)\s*(trieu|tr|k|nghin)?', raw)
    if around_match:
        val = float(around_match.group(1).replace(',', '.'))
        unit = around_match.group(2) or ('k' if val >= 50 else 'trieu')
        mult = 1_000_000 if ('tr' in unit or 'trieu' in unit) else 1_000
        base = val * mult
        return {"min_price": base * 0.7, "max_price": base * 1.3}

    # Generic keywords
    if 'gia re' in raw or 'tiet kiem' in raw or 'sinh vien' in raw:
        return {"min_price": 0, "max_price": 5_000_000}
    if 'cao cap' in raw or 'flagship' in raw:
        return {"min_price": 15_000_000, "max_price": None}

    return {"min_price": None, "max_price": None}

def calculate_text_similarity(text_a: str, text_b: str) -> float:
    """Simple token-based Jaccard/Overlap similarity for text features"""
    words_a = set(remove_accents(text_a).split())
    words_b = set(remove_accents(text_b).split())
    if not words_a or not words_b:
        return 0.0
    intersection = words_a.intersection(words_b)
    union = words_a.union(words_b)
    return len(intersection) / len(union)

def get_hybrid_recommendations(
    all_products: List[Dict[str, Any]],
    target_product_id: Optional[str] = None,
    user_purchased_ids: Optional[List[str]] = None,
    category_id: Optional[str] = None,
    limit: int = 4
) -> List[Dict[str, Any]]:
    """
    Generate Top-K recommendations using Hybrid scoring:
    1. Content-based similarity to current product / category
    2. Rating and popularity weight (Collaborative signal)
    3. Exclude already purchased products
    """
    if not all_products:
        return []

    target_product = None
    if target_product_id:
        for p in all_products:
            if p.get("id") == target_product_id:
                target_product = p
                break

    purchased_set = set(user_purchased_ids or [])
    scored_products = []

    for p in all_products:
        # Exclude target product itself
        if target_product and p.get("id") == target_product.get("id"):
            continue

        score = 0.0

        # 1. Content-Based Score
        if target_product:
            # Same category bonus
            if p.get("categoryId") == target_product.get("categoryId"):
                score += 0.4
            # Text similarity on name & description
            text_sim = calculate_text_similarity(
                f"{target_product.get('name', '')} {target_product.get('description', '')}",
                f"{p.get('name', '')} {p.get('description', '')}"
            )
            score += text_sim * 0.4
        elif category_id and p.get("categoryId") == category_id:
            score += 0.5

        # 2. Rating & Popularity Weight (Collaborative signal)
        rating = float(p.get("rating", 4.5))
        review_count = int(p.get("reviewCount", 10))
        popularity_score = (rating / 5.0) * 0.2 + min(review_count / 100.0, 1.0) * 0.1
        score += popularity_score

        # 3. Featured / New bonus
        if p.get("isFeatured"):
            score += 0.1
        if p.get("isNew"):
            score += 0.05

        # 4. Penalty if already purchased
        if p.get("id") in purchased_set:
            score *= 0.3

        scored_products.append((score, p))

    # Sort descending by score
    scored_products.sort(key=lambda x: x[0], reverse=True)
    
    # Fallback to Top items if not enough
    results = [item[1] for item in scored_products[:limit]]
    if len(results) < limit:
        remaining = [p for p in all_products if p not in results and p.get("id") != target_product_id]
        results.extend(remaining[:(limit - len(results))])

    return results
