================================================================
  BÁO CÁO GIỮA KỲ - ĐỀ TÀI SỐ 8
  MẠNG PHÂN PHỐI NỘI DUNG (CDN - Content Delivery Networks)
  Môn: Ứng dụng và Lập trình Web - 503073
  Học kỳ 2 - Năm học 2025-2026
================================================================

I. THÔNG TIN SINH VIÊN
----------------------------------------------------------------
  Họ tên   : [Điền tên của bạn]
  MSSV     : [Điền MSSV của bạn]
  Lớp      : [Điền lớp của bạn]
  Email    : [Điền email của bạn]

  Ghi chú  : Bài nộp thực hiện độc lập (1 thành viên)


II. CẤU TRÚC THƯ MỤC NỘP BÀI
----------------------------------------------------------------
  CDN_GiuaKy/
  ├── Readme.txt                  ← File này (hướng dẫn chấm)
  ├── Bao_Cao_CDN.md              ← Báo cáo kỹ thuật (Markdown)
  ├── Kich_Ban_Thuyet_Trinh.md    ← Kịch bản video thuyết trình
  │
  ├── index.html                  ← Trang chính Dashboard súc tích
  ├── css/style.css               ← Giao diện Glassmorphism cao cấp
  ├── js/tracker.js               ← Logic đo REAL latency qua Probes
  │
  └── slides/
      └── slide.html              ← Slide thuyết trình chuyên nghiệp


III. LINK DEMO TRỰC TUYẾN (KHUYẾN NGHỊ SỬ DỤNG)
----------------------------------------------------------------
  🌐 Website Demo (Github Pages + Fastly CDN):
     https://chimpk.github.io/cdn-demo-midterm/

  📁 Mã nguồn (Github Repository):
     https://github.com/chimpk/cdn-demo-midterm

  ✅ Điểm nhấn: Trang demo sử dụng đo lường thực tế 100%, 
     không dùng con số giả lập hay random.


IV. CHẠY DEMO TRÊN MÁY CỤC BỘ (LOCAL)
----------------------------------------------------------------
  Cách mở:
    1. Double-click vào file  index.html  (ở thư mục gốc)

  🔍 Cơ chế đo thật trên Local:
    - Hệ thống tự động phát hiện môi trường Local (file://).
    - Để minh họa kịch bản "Không có CDN", web tự động gửi 
      lệnh đo (Probes) tới 3 server đặt tại Mỹ (AWS, HttpBin).
    - Kết quả trả về là độ trễ mạng thực tế từ máy bạn tới Mỹ 
      (thường >200ms) — Phản ánh chính xác TTFB khi không có CDN.


V. HƯỚNG DẪN KIỂM TRA CÁC TÍNH NĂNG CHÍNH
----------------------------------------------------------------
  ── TÍNH NĂNG 1: ĐO LƯỜNG TTFB REAL-TIME ──
  1. Ô số 1: Hiển thị TTFB (ms) đo bằng Performance API.
  2. Bảng "Chi tiết probe": Hiển thị kết quả đo thật từ các 
     endpoint (AWS, Cloudfront, cdnjs...) để đối chiếu.
  3. Màu XANH = Có CDN tối ưu | Màu ĐỎ = Truy cập thẳng Origin Mỹ.

  ── TÍNH NĂNG 2: KIỂM TRA EDGE CACHE STATUS ──
  1. Ô số 3: Tự động bắt Header từ server Edge (Fastly/Netlify).
  2. Hiển thị "HIT" khi dữ liệu được lấy từ bộ nhớ đệm tại 
     trạm Edge gần Việt Nam nhất (Singapore/HongKong).

  ── TÍNH NĂNG 3: SO SÁNH HIỆU NĂNG ──
  - Chạy Local (Đỏ): Latency tới Mỹ cao (~250ms).
  - Chạy Online (Xanh): Latency tới CDN Edge thấp (<60ms).


VI. GIẢI THÍCH KỸ THUẬT (PHƯƠNG PHÁP ĐO)
----------------------------------------------------------------
  Dự án sử dụng các phương pháp đo lường chuẩn W3C chuyên nghiệp:
  
  1. Navigation Timing API: Đo TTFB của chính trang đang tải.
     TTFB = responseStart - requestStart;

  2. Resource Timing API + Image Probes: 
     Kỹ thuật vượt rào cản CORS trên Local để lấy latency thật 
     từ máy trạm tới các cụm server quốc tế.

  3. Glassmorphism UI: CSS hiện đại với backdrop-filter, 
     radial-gradient và mesh animation cho giao diện cao cấp.


VII. THÔNG TIN THÊM
----------------------------------------------------------------
  - Báo cáo chi tiết: xem file  Bao_Cao_CDN.md
  - Video minh họa: (Link video thuyết trình của bạn)

================================================================
