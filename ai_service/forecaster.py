"""
AI Sales & Demand Forecasting Module
Simulates Hybrid-Prophet-ARIMA Time-Series Analysis with Seasonality & Trend
"""

import math
from datetime import datetime, timedelta
from typing import Dict, Any, List

def generate_sales_forecast(days: int = 30) -> Dict[str, Any]:
    """
    Generate historical actual sales (last 14 days) and predicted sales (next N days)
    with weekly seasonality, upward growth trend, and 95% confidence intervals.
    """
    today = datetime.now()
    historical_points = []
    
    # 1. Generate 14 days of historical data (Unit: Million VND)
    # Baseline ~ 24 - 32 million VND with weekend peaks
    base_revenue = 25.0
    for i in range(14, 0, -1):
        d = today - timedelta(days=i)
        day_of_week = d.weekday() # 0 = Monday, 6 = Sunday
        # Weekend peak effect
        seasonality = 4.0 if day_of_week in [4, 5, 6] else -2.0
        # Pseudo cycle variation
        wave = 3.5 * math.sin((14 - i) * 0.8)
        value = round(max(15.0, base_revenue + seasonality + wave + (14 - i) * 0.1), 1)
        
        historical_points.append({
            "date": d.strftime("%m-%d"),
            "fullDate": d.strftime("%Y-%m-%d"),
            "actualRevenue": value,
            "ordersCount": int(value * 1.3)
        })

    # 2. Generate Future Forecast (next N days, e.g. 30 days)
    forecast_points = []
    growth_rate = 0.085 # +8.5%
    for i in range(0, days):
        d = today + timedelta(days=i)
        day_of_week = d.weekday()
        seasonality = 4.5 if day_of_week in [4, 5, 6] else -1.8
        trend = (i / 30.0) * (base_revenue * growth_rate)
        wave = 3.8 * math.sin(i * 0.75)
        
        predicted = round(base_revenue + seasonality + trend + wave + 1.5, 1)
        confidence_margin = round(2.0 + (i / 30.0) * 1.5, 1)
        
        upper_bound = round(predicted + confidence_margin, 1)
        lower_bound = round(max(10.0, predicted - confidence_margin), 1)
        
        forecast_points.append({
            "date": d.strftime("%m-%d"),
            "fullDate": d.strftime("%Y-%m-%d"),
            "predictedRevenue": predicted,
            "upperBound": upper_bound,
            "lowerBound": lower_bound,
            "predictedOrders": int(predicted * 1.35)
        })

    # 3. Model Performance Metrics
    metrics = {
        "modelName": "Hybrid-Prophet-ARIMA-v2.1",
        "forecastGrowth": "+8.5%",
        "mape": "4.12%",
        "rmse": "845,200 VND",
        "r2Score": "95.88%",
        "confidenceLevel": "95%"
    }

    # 4. Actionable Business Insights
    insights = [
        {
            "id": 1,
            "category": "Điện thoại & Tablet AI",
            "title": "Tăng trưởng nhu cầu cuối tuần",
            "description": "Nhu cầu danh mục Điện thoại và Phụ kiện dự kiến tăng 28% vào các ngày Thứ 6 - Chủ Nhật. Khuyến nghị chuẩn bị đủ tồn kho.",
            "impact": "HIGH"
        },
        {
            "id": 2,
            "category": "Tai nghe & Âm thanh",
            "title": "Xu hướng mua kèm tai nghe chống ồn",
            "description": "Tỷ lệ mua kèm Tai nghe ANC cùng với Laptop AI đạt 42%. Nên kích hoạt chương trình combo khuyến mãi.",
            "impact": "MEDIUM"
        },
        {
            "id": 3,
            "category": "Nhà thông minh (Smart Home)",
            "title": "Dự báo đợt mua sắm đầu tháng",
            "description": "Doanh số Robot hút bụi và Camera AI tăng đột biến vào tuần đầu mỗi tháng sau kỳ nhận lương.",
            "impact": "MEDIUM"
        }
    ]

    return {
        "metrics": metrics,
        "historical": historical_points,
        "forecast": forecast_points,
        "insights": insights
    }
