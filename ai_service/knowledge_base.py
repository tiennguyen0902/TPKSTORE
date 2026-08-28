"""
Knowledge Base & Policies for RAG Chatbot
SHOPBEE / STORE AI
"""

POLICIES = {
    "shipping": {
        "title": "Chính sách Vận chuyển & Giao hàng",
        "content": (
            "1. Giao hàng hỏa tốc trong 2 giờ tại nội thành Hà Nội và TP.HCM.\n"
            "2. Miễn phí vận chuyển cho tất cả các đơn hàng có giá trị từ 500.000 VNĐ trở lên.\n"
            "3. Đơn hàng dưới 500.000 VNĐ có phí vận chuyển đồng giá 30.000 VNĐ toàn quốc.\n"
            "4. Thời gian giao hàng tiêu chuẩn các tỉnh khác: 1 - 3 ngày làm việc."
        ),
        "keywords": ["vận chuyển", "giao hàng", "ship", "phí ship", "hỏa tốc", "2 giờ", "miễn phí ship"]
    },
    "warranty": {
        "title": "Chính sách Bảo hành Chính hãng",
        "content": (
            "1. 100% sản phẩm phân phối bởi SHOPBEE là hàng chính hãng, có tem và phiếu bảo hành điện tử.\n"
            "2. Thời hạn bảo hành từ 12 đến 24 tháng tùy từng dòng sản phẩm (Điện thoại, Laptop, Đồng hồ, Tai nghe).\n"
            "3. Bảo hành 1 đổi 1 trong vòng 30 ngày nếu có lỗi phần cứng từ nhà sản xuất."
        ),
        "keywords": ["bảo hành", "chính hãng", "đổi mới", "thời hạn bảo hành", "tem bảo hành", "phiếu bảo hành"]
    },
    "returns": {
        "title": "Chính sách Đổi trả & Hoàn tiền",
        "content": (
            "1. Hỗ trợ đổi trả miễn phí trong vòng 7 ngày đầu tiên kể từ khi nhận hàng nếu sản phẩm còn nguyên seal hoặc lỗi NSX.\n"
            "2. Hoàn tiền 100% qua phương thức thanh toán ban đầu (VNPAY / Chuyển khoản) trong vòng 24 - 48 giờ làm việc sau khi nhận lại hàng.\n"
            "3. Khách hàng có thể tạo yêu cầu đổi trả ngay trên trang 'Đơn hàng của tôi' hoặc liên hệ Hotline 1900 6868."
        ),
        "keywords": ["đổi trả", "hoàn tiền", "trả hàng", "7 ngày", "lỗi", "không ưng ý", "yêu cầu đổi trả"]
    },
    "payment": {
        "title": "Phương thức Thanh toán",
        "content": (
            "1. Thanh toán khi nhận hàng (COD - Cash On Delivery).\n"
            "2. Thanh toán trực tuyến qua Cổng VNPAY (Thẻ ATM nội địa, Thẻ quốc tế Visa/Master, Quét mã VNPAY-QR).\n"
            "3. Hỗ trợ ví MoMo QR & chuyển khoản trực tiếp an toàn bảo mật chuẩn SSL 256-bit."
        ),
        "keywords": ["thanh toán", "vnpay", "cod", "chuyển khoản", "thẻ", "momo", "qr"]
    },
    "store_info": {
        "title": "Thông tin Cửa hàng & Hỗ trợ",
        "content": (
            "SHOPBEE - Điểm mua sắm công nghệ số 1 Việt Nam với trải nghiệm AI tư vấn thông minh.\n"
            "Hotline hỗ trợ 24/7: 1900 6868\n"
            "Email hỗ trợ: support@store-ai.example.com\n"
            "Địa chỉ trụ sở: Tầng 8, Tòa nhà Công Nghệ Cao, Hà Nội."
        ),
        "keywords": ["cửa hàng", "shopbee", "hotline", "liên hệ", "địa chỉ", "tổng đài", "email"]
    }
}

FAQ_LIST = [
    {
        "question": "Tôi có được kiểm tra hàng trước khi thanh toán không?",
        "answer": "Có, SHOPBEE hỗ trợ đồng kiểm khi nhận hàng đối với tất cả đơn hàng COD."
    },
    {
        "question": "Làm sao để biết sản phẩm còn hàng hay không?",
        "answer": "Trạng thái tồn kho thực tế được cập nhật trực tiếp trên trang chi tiết sản phẩm. Nếu hiển thị 'Còn hàng', bạn có thể đặt mua ngay."
    },
    {
        "question": "Mất bao lâu để nhận được hàng hỏa tốc?",
        "answer": "Dịch vụ giao hỏa tốc 2 giờ áp dụng tại khu vực nội thành Hà Nội & TP.HCM từ 8:00 đến 20:00 hàng ngày."
    }
]
