# KỊCH BẢN THUYẾT TRÌNH VIDEO 15 PHÚT (BẢN SOLO 1 NGƯỜI)

> 🚨 **Lưu ý:** Làm 1 người sẽ bị trừ 0.5đ tự động theo Bareme. Bù lại bằng cách thực nghiệm Demo thật sắc nét và lời dẫn tự tin, mạch lạc.

---

## 🗺️ TỔNG QUAN LUỒNG TRÌNH BÀY

```
[0:00–8:00]   SLIDE (Slides 1→5) — Lý thuyết, lợi ích, nhà cung cấp
[8:00–12:30]  WEB DEMO — Tắt slide, bật trình duyệt, 2 thực nghiệm trực tiếp
[12:30–15:00] SLIDE (Slides 8→9) — Các chiến lược Invalidation + Kết luận
```

> 💡 **Chuẩn bị trước khi quay video:**
> - Mở sẵn **2 tab trình duyệt**:
>   - Tab 1: `file:///d:/doc/cdn_demo/index.html` (Local — Để thấy độ trễ thật tới Mỹ ~300ms)
>   - Tab 2: `https://chimpk.github.io/cdn-demo-midterm/` (Github Pages + Fastly CDN — TTFB < 60ms)
> - Mở sẵn slide thuyết trình ở một tab khác để chuyển đổi nhanh (Alt+Tab).

---

## PHẦN 1 — SLIDE: MỞ ĐẦU & LÝ THUYẾT (0:00 – 4:00)

> 🖥️ **MÀN HÌNH:** Slide 1 (Trang bìa CDN)

*(Bật webcam, nhìn thẳng, mỉm cười tự tin)*

**BẠN:** Xin chào thầy và các bạn. Chào mừng mọi người đến với bài báo cáo Giữa kỳ môn Ứng dụng và Lập trình Web. Dự án hôm nay em thực hiện hoàn toàn độc lập, xin trình bày về **Đề tài số 8: Mạng Phân Phối Nội Dung — Content Delivery Networks (CDN).**

---

> 🖥️ **MÀN HÌNH:** Slide 2 (World Wide Wait — So sánh 350ms vs <50ms)

**BẠN:** Để thấy CDN quan trọng đến mức nào, em bắt đầu bằng bài toán vật lý thực tế. Khi không có CDN, máy chủ gốc đặt tại Mỹ phải gánh toàn bộ người dùng toàn cầu. Với Việt Nam, mỗi truy vấn (request) phải vượt hàng ngàn km cáp quang dưới đáy biển — dẫn đến độ trễ, hay còn gọi là **TTFB (Time To First Byte - Thời gian phản hồi byte dữ liệu đầu tiên)**, lên tới **350ms**. Tức là nửa giây chờ trắng trang chỉ để server phát đi tín hiệu đầu tiên. Giới kỹ sư gọi thảm họa này là "World Wide Wait".

---

> 🖥️ **MÀN HÌNH:** Slide 3 (Kiến trúc BGP Anycast + PoPs)

**BẠN:** CDN ra đời để giải quyết triệt để bài toán này. Thay vì 1 máy chủ gốc, CDN xây dựng hàng ngàn trạm tiếp sóng phân bố khắp thế giới gọi là **PoPs (Points of Presence - Điểm Hiện Diện)**. Giao thức mạng lõi **BGP Anycast (Border Gateway Protocol - Giao thức Định tuyến Cổng Biên)** tự động điều hướng kết nối mạng tới trạm Edge Server gần người dùng nhất — ví dụ sinh viên Việt Nam truy cập sẽ tự động trỏ về trạm TP. HCM hoặc Singapore. Dữ liệu đã được lưu sẵn tại đó, phản hồi tức thì về máy tính mà không cần lội ngược dòng băng thông về tận Mỹ gốc.

---

## PHẦN 2 — SLIDE: LỢI ÍCH & NHÀ CUNG CẤP (4:00 – 8:00)

> 🖥️ **MÀN HÌNH:** Slide 4 (4 lợi ích sống còn)

**BẠN:** Đi vào ứng dụng thực tế, CDN mang lại 4 lợi ích cốt lõi mà mọi hệ thống lớn đều cần:

Thứ nhất, **Hiệu suất** — TTFB từ 350ms rút xuống còn dưới 50ms, cải thiện trải nghiệm người dùng gần như tuyệt đối.

Thứ hai, **Độ sẵn sàng** — Khi Origin sập, Edge CDN vẫn tiếp tục phục vụ bản Stale Cache, người dùng không hề hay biết web đang gặp sự cố.

Thứ ba, **Khả năng mở rộng** — Trong đợt Flash Sale, đến 90% lưu lượng đột biến bị CDN hấp thụ trước khi chạm tới Origin Server.

Thứ tư, **Bảo mật** — CDN là tấm khiên khổng lồ hấp thụ các cuộc tấn công mạng **DDoS (Distributed Denial of Service - Tấn công Từ chối Dịch vụ Phân tán)** bằng tổng băng thông của hàng trăm trạm PoPs gộp lại.

---

> 🖥️ **MÀN HÌNH:** Slide 5 (Các nền tảng CDN phổ biến)

**BẠN:** Về thị trường, hiện có các nhà cung cấp CDN cực kỳ phổ biến sau:

**Cloudflare** là giải pháp thông dụng với developer nhờ giao diện dễ dùng, Proxy DNS trực tiếp, và hệ thống WAF + Custom Rules linh hoạt.

**Akamai** là ông lớn viễn thông chuyên hạ tầng Media Streaming quy mô khổng lồ cho các tập đoàn.

**AWS CloudFront** là giải pháp tích hợp chuyên sâu, lý tưởng cho dự án đã chạy trên Amazon.

Và đặc biệt, **Fastly** — đây chính là CDN mà **Github Pages sử dụng** và cũng là nền tảng trong Demo của em. Cùng nhóm này còn có **Vercel** và **Netlify** — đều cung cấp Edge Network tối ưu cho lập trình Frontend.

---

## PHẦN 3 — WEB DEMO: 2 THỰC NGHIỆM TRỰC TIẾP (8:00 – 12:30)

> 🖥️ **CHUYỂN MÀN HÌNH:** **TẮT SLIDE** → Bật Tab 1 trình duyệt (`file:///d:/doc/cdn_demo/index.html`)
> *(Giao diện báo màu Đỏ — "Đo thực tế tới Origin Mỹ")*

**BẠN:** Bây giờ em chuyển sang phần Demo thực nghiệm trực tiếp. Em đã tự thiết kế một **Bảng Phân Tích Hiệu Năng Mạng Tự Động** — ứng dụng kết hợp giữa **Resource Timing API** và **Image Probes**. Đặc điểm của bản demo này là **ĐO THẬT 100%**, không dùng con số giả lập.

Đây là giao diện khi em chạy trực tiếp từ tệp tin trên máy tính cá nhân (chưa qua CDN). Vì chạy từ `file://` nên trình duyệt chặn `fetch()`. Hệ thống tự động dùng kỹ thuật **Image Probes** để vượt CORS, gửi tín hiệu tới các server gốc tại Mỹ: HTTPBin, Ipify, Ident. Kết quả thực tế máy em hiện tại là khoảng **300ms** — chứng minh độ trễ cực cao khi gói tin phải vượt đại dương.

---

**BẠN:** Để minh chứng cho tính ổn định, em sẽ bấm nút **"🔄 Phân tích lại"**. Mọi người thấy chỉ số vẫn duy trì ở mức cao trên 250ms.

Tiếp đến, em chuyển sang **Tab 2** — là phiên bản đã Deploy lên Github Pages. Chỉ trong tích tắc, Dashboard báo xanh lịm! Chỉ số TTFB rơi thẳng xuống chỉ còn khoảng **40ms** — nhanh hơn khoảng 6–8 lần.

Tại sao? Vì Github Pages sử dụng hạ tầng **Fastly CDN**. Máy chủ Edge của Fastly tại Singapore hoặc Hong Kong đã lưu sẵn dữ liệu và phục vụ ngay lập tức. Ô Cache Header báo trạng thái **HIT** — bằng chứng CDN đang hoạt động.

---

### 🔬 THỰC NGHIỆM 2: CACHE INVALIDATION qua CACHE BUSTING (11:00 – 12:30)

> 🖥️ **MÀN HÌNH:** Click nút **"🚀 Cập nhật App (Invalidation)"**
> *(Banner vàng hiện ra: Cache Busting v2.0... Dashboard tự động đo lại)*

**BẠN:** Tiếp theo là thực nghiệm về **Cache Invalidation**. Em sẽ bấm nút "Cập nhật App".

Hệ thống sử dụng kỹ thuật **Cache Busting** — thêm query string `?v=2` vào URL. CDN xem đây là URL hoàn toàn mới nên buộc phải quay về Origin kéo dữ liệu. Kết quả báo **Vàng** với TTFB cao — đây là trạng thái **Cache MISS**.

*(Đợi Dashboard hiện xong kết quả MISS, sau đó bấm tiếp nút 🔄 Phân tích lại)*

**BẠN:** Bấm phân tích lại — Màn hình lập tức xanh trở lại! Vì sau lần MISS đầu tiên, CDN đã lưu đệm phiên bản v2.0 tại trạm Edge. Đây là minh chứng cho vòng đời của dữ liệu: Phải có **Invalidation** thì người dùng mới nhận được bản mới nhất thay vì bị kẹt với Stale Data.

---

## PHẦN 4 — SLIDE: CÁC CHIẾN LƯỢC INVALIDATION + KẾT LUẬN (12:30 – 15:00)

> 🖥️ **CHUYỂN MÀN HÌNH:** **TẮT TRÌNH DUYỆT** → Bật lại **Slide 8 (4 Phương pháp Invalidation)**

**BẠN:** Vừa rồi em đã demo Cache Busting. Nhưng trong thực tế CDN có **4 phương pháp Invalidation** chính:

Thứ nhất, **TTL Expiry** — đặt thời hạn sống qua header `Cache-Control: max-age`. Hết thời gian thì Edge tự kiểm tra lại với Origin.

Thứ hai, **Purge API** — gọi API xóa Cache tức thì. Có thể xóa theo URL, theo Tag, hoặc xóa toàn bộ. Dùng khi cần hotfix khẩn cấp.

Thứ ba, **Cache Busting** — đúng như vừa demo, thêm `?v=2` vào URL. CDN xem là URL mới và không dùng Cache cũ.

Thứ tư, **Stale-While-Revalidate** — trả bản cũ cho người dùng ngay lập tức, đồng thời cập nhật ngầm ở nền. Người dùng tiếp theo sẽ nhận bản mới. Cân bằng giữa tốc độ và độ tươi mới.

---

> 🖥️ **MÀN HÌNH:** Chuyển sang **Slide 9 (Kết luận)**

**BẠN:** Tóm lại, qua 2 thực nghiệm trực tiếp và phần lý thuyết vừa rồi, đề tài đã chứng minh:

✅ **TTFB giảm từ ~300ms xuống <50ms** khi có CDN Edge — nhanh hơn khoảng 6–8 lần.

✅ **Cache Invalidation** là kỹ thuật sống còn — với 4 phương pháp: TTL, Purge API, Cache Busting, và Stale-While-Revalidate.

Thế giới lập trình mạng ngày nay đã dịch chuyển hoàn toàn ra **Edge Computing** — nơi dữ liệu được xử lý ngay tại biên, sát người dùng nhất. Nắm vững CDN là nắm chìa khoá xây dựng ứng dụng hiệu năng cao, bền vững ở quy mô toàn cầu.

Em xin kết thúc bài báo cáo Giữa Kỳ. Cảm ơn Thầy/Cô đã lắng nghe! 🙏

🔗 **Link Demo:** `https://chimpk.github.io/cdn-demo-midterm/`

---

## 📋 BẢNG TÓM TẮT HÀNH ĐỘNG THEO THỜI GIAN

| Thời gian | Màn hình | Hành động |
|---|---|---|
| 0:00 | Slide 1 (Trang bìa) | Mở đầu, giới thiệu bản thân |
| 0:30 | Slide 2 (World Wide Wait) | Nêu bài toán 350ms vs <50ms |
| 2:00 | Slide 3 (Kiến trúc PoPs) | Giải thích BGP Anycast + sơ đồ |
| 4:00 | Slide 4 (4 lợi ích) | Trình bày 4 lợi ích sống còn |
| 6:00 | Slide 5 (Các nền tảng) | So sánh Cloudflare/Akamai/AWS/Fastly |
| 8:00 | **TẮT SLIDE** | Chuyển sang trình duyệt |
| 8:10 | Tab 1 – Local file | Mở `index.html` → Image Probes báo Đỏ ~300ms |
| 9:30 | **Tab 2 – Github Pages** | Chuyển tab → báo Xanh ~40ms, HIT |
| 11:00 | Tab 2 – Bấm "Cập nhật App" | Cache Busting → MISS → đo lại → HIT |
| 12:30 | **BẬT SLIDE 8** | 4 phương pháp Invalidation |
| 14:00 | **SLIDE 9** | Kết luận, cảm ơn, link demo |
