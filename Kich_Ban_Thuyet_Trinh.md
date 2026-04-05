# KỊCH BẢN THUYẾT TRÌNH VIDEO 15 PHÚT (BẢN SOLO 1 NGƯỜI)

> 🚨 **Lưu ý:** Làm 1 người sẽ bị trừ 0.5đ tự động theo Bareme. Bù lại bằng cách thực nghiệm Demo thật sắc nét và lời dẫn tự tin, mạch lạc.

---

## 🗺️ TỔNG QUAN LUỒNG TRÌNH BÀY

```
[0:00–8:00]   SLIDE (Slides 1→5) — Lý thuyết, lợi ích, nhà cung cấp
[8:00–13:00]  WEB DEMO — Tắt slide, bật trình duyệt, 3 thực nghiệm trực tiếp
[13:00–15:00] SLIDE (Slide 9) — Kết luận, cảm ơn
```

> 💡 **Chuẩn bị trước khi quay video:**
> - Mở sẵn **2 tab trình duyệt**:
>   - Tab 1: `file:///d:/doc/CDN_GiuaKy/web_demo/index.html` (Local — Để thấy độ trễ thật tới Mỹ ~300ms)
>   - Tab 2: `https://[username].github.io/cdn-demo/` (Github Pages — Để thấy độ trễ thấp từ CDN PoP SEA < 60ms)
> - Mở sẵn slide thuyết trình ở một tab khác để chuyển đổi nhanh (Alt+Tab).

---

## PHẦN 1 — SLIDE: MỞ ĐẦU & LÝ THUYẾT (0:00 – 4:00)

> 🖥️ **MÀN HÌNH:** Slide 1 (Trang bìa CDN)

*(Bật webcam, nhìn thẳng, mỉm cười tự tin)*

**BẠN:** Xin chào thầy và các bạn. Chào mừng mọi người đến với bài báo cáo Giữa kỳ môn Ứng dụng và Lập trình Web. Dự án hôm nay em thực hiện hoàn toàn độc lập, xin trình bày về **Đề tài số 8: Mạng Phân Phối Nội Dung — Content Delivery Networks (CDN).**

---

> 🖥️ **MÀN HÌNH:** Slide 2 (World Wide Wait — So sánh 350ms vs <30ms)

**BẠN:** Để thấy CDN quan trọng đến mức nào, em bắt đầu bằng bài toán vật lý thực tế. Khi không có CDN, máy chủ gốc đặt tại Mỹ phải gánh toàn bộ người dùng toàn cầu. Với Việt Nam, mỗi truy vấn (request) phải vượt hàng ngàn km cáp quang dưới đáy biển — dẫn đến độ trễ, hay còn gọi là **TTFB (Time To First Byte - Thời gian phản hồi byte dữ liệu đầu tiên)**, lên tới **350ms**. Tức là nửa giây chờ trắng trang chỉ để server phát đi tín hiệu đầu tiên. Giới kỹ sư gọi thảm họa này là "World Wide Wait".

---

> 🖥️ **MÀN HÌNH:** Slide 3 (Kiến trúc BGP Anycast + PoPs)

**BẠN:** CDN ra đời để giải quyết triệt để bài toán này. Thay vì 1 máy chủ gốc, CDN xây dựng hàng ngàn trạm tiếp sóng phân bố khắp thế giới gọi là **PoPs (Points of Presence - Điểm Hiện Diện)**. Giao thức mạng lõi **BGP Anycast (Border Gateway Protocol - Giao thức Định tuyến Cổng Biên)** tự động điều hướng kết nối mạng tới trạm Edge Server gần người dùng nhất — ví dụ sinh viên Việt Nam truy cập sẽ tự động trỏ về trạm TP. HCM hoặc Singapore. Dữ liệu đã được lưu sẵn tại đó, phản hồi tức thì về máy tính mà không cần lội ngược dòng băng thông về tận Mỹ gốc.

---

## PHẦN 2 — SLIDE: LỢI ÍCH & NHÀ CUNG CẤP (4:00 – 8:00)

> 🖥️ **MÀN HÌNH:** Slide 4 (4 lợi ích sống còn)

**BẠN:** Đi vào ứng dụng thực tế, CDN mang lại 4 lợi ích cốt lõi mà mọi hệ thống lớn đều cần:

Thứ nhất, **Hiệu suất** — TTFB từ 350ms rút xuống còn dưới 30ms, cải thiện trải nghiệm người dùng gần như tuyệt đối.

Thứ hai, **Độ sẵn sàng** — Khi Origin sập, Edge CDN vẫn tiếp tục phục vụ bản Stale Cache, người dùng không hề hay biết web đang gặp sự cố.

Thứ ba, **Khả năng mở rộng** — Trong đợt Flash Sale, đến 90% lưu lượng đột biến bị CDN hấp thụ trước khi chạm tới Origin Server.

Thứ tư, **Bảo mật** — CDN là tấm khiên khổng lồ hấp thụ các cuộc tấn công mạng **DDoS (Distributed Denial of Service - Tấn công Từ chối Dịch vụ Phân tán)** bằng tổng băng thông của hàng trăm trạm PoPs gộp lại.

---

> 🖥️ **MÀN HÌNH:** Slide 5 (Các nền tảng CDN phổ biến)

**BẠN:** Về thị trường, hiện có các nhà cung cấp CDN cực kỳ phổ biến sau:

**Cloudflare** là giải pháp thông dụng với developer nhờ giao diện dễ dùng, Proxy DNS trực tiếp, và hệ thống Custom Rules linh hoạt. **Đây cũng là nền tảng em sử dụng trong Demo.**

**Akamai** là ông lớn viễn thông chuyên hạ tầng Media Streaming quy mô khổng lồ cho các tập đoàn.

**AWS CloudFront** là giải pháp tích hợp chuyên sâu, lý tưởng cho dự án đã chạy trên Amazon.

Và đặc biệt với lĩnh vực **Lập trình Web Frontend**, các nền tảng như **Vercel** hay **Netlify** đang là lựa chọn ưu tiên hàng đầu do cung cấp sẵn hệ thống Edge Network tối ưu hóa tuyệt đối cho các framework như React/Next.js.

---

## PHẦN 3 — WEB DEMO: 3 THỰC NGHIỆM TRỰC TIẾP (8:00 – 13:00)

> 🖥️ **CHUYỂN MÀN HÌNH:** **TẮT SLIDE** → Bật Tab 1 trình duyệt (`file:///d:/doc/cdn_demo/index.html`)
> *(Giao diện báo màu Vàng — "Chưa đánh chặn/Local")*

**BẠN:** Bây giờ em chuyển sang phần Demo thực nghiệm trực tiếp. Em đã tự thiết kế một **Bảng Phân Tích Hiệu Năng Mạng Tự Động** — ứng dụng kết hợp giữa **Resource Timing API** và **Navigation Timing**. Đặc điểm của bản demo này là **ĐO THẬT 100%**, không dùng con số giả lập.

Đây là giao diện khi em chạy trực tiếp từ tệp tin trên máy tính cá nhân (chưa qua CDN). Mọi người có thể thấy hàng loạt mốc đo (Probes) ở bảng chi tiết bên dưới. Hệ thống đang tự động gửi tín hiệu tới các cụm server gốc tại Mỹ như AWS, HttpBin. Kết quả thực tế máy em hiện tại là **304ms** — Một con số báo động đỏ, chứng minh độ trễ cực cao khi gói tin phải vượt đại dương mà không có sự trợ giúp của CDN.

---

**BẠN:** Để minh chứng cho tính ổn định, em sẽ bấm nút **"🔄 Chạy Lại Phân Tích"** ở dưới cùng. Dashboard sẽ bắt đầu đo lại từ đầu các kết nối tới Mỹ. Mọi người thấy chỉ số vẫn duy trì ở mức cao trên 250ms. 

Tiếp đến, em chuyển sang **Tab 2** — là phiên bản đã Deploy lên Github Pages. Chỉ trong tích tắc, Dashboard báo xanh lịm! Chỉ số TTFB rơi thẳng xuống chỉ còn khoảng **38ms**. 

Tại sao lại có sự khác biệt khủng khiếp này? Vì Github Pages sử dụng hạ tầng Fastly CDN. Thay vì gói tin phải bay sang Mỹ như ở tab Local, thì giờ đây máy chủ Edge của Fastly tại Singapore hoặc Hong Kong đã "đánh chặn" và phục vụ ngay lập tức. Ô số 3 báo trạng thái **HIT** kèm các thông số kỹ thuật (Age, Via) — bằng chứng thép cho thấy CDN đang hoạt động hiệu quả.

---

### 🔬 THỰC NGHIỆM 2: CACHE INVALIDATION & VERSIONING (11:30 – 13:00)

> 🖥️ **MÀN HÌNH:** Click nút **"🚀 Cập nhật App (Invalidation)"**
> *(Banner vàng hiện ra: Mã nguồn đã cập nhật v2.0... Dashboard tự động đo lại)*

**BẠN:** Tiếp theo là thực nghiệm cực kỳ quan trọng trong quản trị hạ tầng: **Cache Invalidation**. Giả sử em vừa sửa code trên Origin Mỹ và tung ra phiên bản v2.0. Em sẽ bấm nút "Cập nhật App". 

Mọi người hãy quan sát bảng chỉ số: Kết quả vừa trả về báo **Vàng/Đỏ** với TTFB cao. Lý do là vì em đã thực hiện lệnh xóa Cache (Purge) ảo — CDN phát hiện URL này có version mới nên buộc phải quay về Mỹ kéo dữ liệu. Đây gọi là trạng thái **Cache MISS**.

*(Đợi Dashboard hiện xong kết quả MISS, sau đó bấm tiếp nút 🔄 Phân tích lại)*

**BẠN:** Ngay sau đó, nếu em bấm phân tích lại một lần nữa — Màn hình lập tức xanh trở lại! Tại sao? Vì sau lần MISS đầu tiên, CDN đã kịp thời lưu đệm (Caching) phiên bản v2.0 tại trạm Edge. Đây là minh chứng cho vòng đời của dữ liệu: Phải có **Invalidation** thì người dùng mới nhận được bản mới nhất thay vì dùng bản cũ trong Cache (Stale Data).

Thứ hai là **Custom Rules (Cấu hình ngoại lệ)**. Hệ thống CDN ưu việt ở chỗ cho phép ta ghi đè mọi quy tắc cache tĩnh bằng lệnh ưu tiên, ví dụ: định tuyến thư mục `*domain.com/admin/*` được Bypass (Bỏ qua CDN để dùng dữ liệu động). Quyền kiểm soát này mang lại khả năng linh hoạt tối đa cho kiến trúc thay vì phải chỉnh Code trên server gốc.

---

## PHẦN 4 — SLIDE: KẾT LUẬN (13:00 – 15:00)

> 🖥️ **CHUYỂN MÀN HÌNH:** **TẮT TRÌNH DUYỆT** → Bật lại **Slide 9 (Kết luận)**

**BẠN:** Tóm lại, qua 3 thực nghiệm vừa rồi, đề tài đã chứng minh được:

✅ **TTFB giảm từ >200ms xuống <40ms** khi có Edge CDN can thiệp.

✅ **Cache Invalidation** là kỹ thuật sống còn để đảm bảo người dùng nhận đúng phiên bản mới nhất sau khi cập nhật.

✅ **Custom Rules** cho phép kỹ sư kiểm soát chính xác hành vi Cache, không phụ thuộc vào cấu hình mặc định của máy chủ.

Thế giới lập trình mạng ngày nay đã dịch chuyển hoàn toàn ra **Edge Computing** — nơi dữ liệu được xử lý ngay tại biên, sát người dùng nhất. Nắm vững CDN là nắm chìa khoá xây dựng ứng dụng hiệu năng cao, bền vững ở quy mô toàn cầu.

Em xin kết thúc bài báo cáo Giữa Kỳ. Cảm ơn Thầy/Cô đã lắng nghe! 🙏

🔗 **Link Demo:** `https://chimpk.github.io/cdn-demo-midterm/`

---

## 📋 BẢNG TÓM TẮT HÀNH ĐỘNG THEO THỜI GIAN

| Thời gian | Màn hình | Hành động |
|---|---|---|
| 0:00 | Slide 1 (Trang bìa) | Mở đầu, giới thiệu bản thân |
| 0:30 | Slide 2 (World Wide Wait) | Nêu bài toán 350ms vs <30ms |
| 2:00 | Slide 3 (Kiến trúc PoPs) | Giải thích BGP Anycast + sơ đồ |
| 4:00 | Slide 4 (4 lợi ích) | Trình bày 4 lợi ích sống còn |
| 6:00 | Slide 5 (Các nền tảng) | So sánh Cloudflare/Akamai/AWS/Vercel |
| 8:00 | **TẮT SLIDE** | Chuyển sang trình duyệt |
| 8:10 | Tab 1 – Local file | Mở `cdn_demo/index.html` → báo Vàng |
| 8:30 | **Tab 2 – Github Pages** | Chuyển tab → báo Xanh, HIT |
| 10:00 | Tab 2 – Bấm Giả lập Origin| Thấy màn hình báo Đỏ trễ quá tải |
| 11:30 | Tab 2 – F5 phục hồi xanh | Trình bày kiến thức Invalidation |
| 13:00 | **BẬT SLIDE 9** | Kết luận, cảm ơn, link demo |
