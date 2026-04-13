# KỊCH BẢN THUYẾT TRÌNH VIDEO 15 PHÚT (BẢN SOLO 1 NGƯỜI)

> 🚨 **Lưu ý:** Làm 1 người sẽ bị trừ 0.5đ tự động theo Bareme. Bù lại bằng cách thực nghiệm Demo thật sắc nét và lời dẫn tự tin, mạch lạc.

---

## 🗺️ TỔNG QUAN LUỒNG TRÌNH BÀY

```
[0:00–0:40]   Slide 0 — Trang bìa, giới thiệu bản thân
[0:40–2:30]   Slide 1 — Bài toán "World Wide Wait" + TTFB
[2:30–4:00]   Slide 2 — Kiến trúc CDN: PoPs + BGP Anycast
[4:00–6:00]   Slide 3 — 4 lợi ích sống còn của CDN
[6:00–8:00]   Slide 4 — Thị trường: Cloudflare / Akamai / AWS / Fastly
[8:00–11:00]  WEB DEMO 1 — Đo TTFB thực: Local (300ms) vs CDN (40ms)
[11:00–12:30] WEB DEMO 2 — Cache Invalidation qua Cache Busting
[12:30–14:00] Slide 7 — 4 phương pháp Invalidation
[14:00–15:00] Slide 8 — Kết luận + Cảm ơn
```

> 💡 **Chuẩn bị trước khi quay video:**
> - Mở sẵn **slide** tại một tab: `file:///d:/doc/cdn_demo/slides/slide.html`
> - Mở sẵn **2 tab trình duyệt demo:**
>   - Tab 1: `file:///d:/doc/cdn_demo/index.html` (Local — đo thật tới Origin Mỹ ~300ms)
>   - Tab 2: `https://chimpk.github.io/cdn-demo-midterm/` (Github Pages + Fastly CDN — TTFB < 60ms)
> - Để **Tab demo KHÔNG reload** trước khi quay — CDN cần có HIT sẵn.
> - Tắt thông báo hệ thống (Do Not Disturb).

---

## ─────────────────────────────────────────────────────────
## PHẦN 1 — SLIDE 0: TRANG BÌA (0:00 – 0:40)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Slide 0 — Trang bìa "CDN · Mạng Phân Phối Nội Dung"
> *(Bật webcam, nhìn thẳng, ngồi thẳng lưng, mỉm cười tự tin)*

**BẠN:**

"Xin chào Thầy/Cô và các bạn. Em là [Tên], thực hiện báo cáo giữa kỳ môn Lập trình Web và Ứng dụng — hoàn toàn độc lập.

Em xin trình bày **Đề tài số 8: Mạng Phân Phối Nội Dung — Content Delivery Networks, gọi tắt là CDN.**

Bài báo cáo này sẽ đi qua 3 phần chính: Lý thuyết kiến trúc CDN, Demo thực nghiệm đo lường TTFB trực tiếp, và cuối cùng là các chiến lược Cache Invalidation. Mời Thầy/Cô và các bạn theo dõi."

---

## ─────────────────────────────────────────────────────────
## PHẦN 2 — SLIDE 1: BÀI TOÁN "WORLD WIDE WAIT" (0:40 – 2:30)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Chuyển sang Slide 1 — "World Wide Wait" (Bấm → hoặc phím mũi tên phải)
> *(Màn hình hiện so sánh 350ms màu đỏ vs <50ms màu xanh)*

**BẠN:**

"Trước khi nói về giải pháp, em muốn trình bày rõ **bài toán gốc rễ** mà CDN ra đời để giải quyết.

Đây là một bài toán vật lý thuần túy: ánh sáng cần thời gian để di chuyển qua cáp quang biển.

Khi một bạn sinh viên tại Hà Nội mở trình duyệt truy cập một website có máy chủ đặt tại New York — gói tin đó phải vượt qua hàng chục nghìn km cáp quang dưới đáy Thái Bình Dương, qua nhiều trạm chuyển tiếp, rồi chờ máy chủ xử lý, rồi dội ngược về.

Kết quả: **TTFB — Time To First Byte**, tức là thời gian từ lúc gửi yêu cầu đến khi nhận được byte dữ liệu đầu tiên — lên tới **350ms**. Gần nửa giây chờ trắng màn hình trước khi website bắt đầu hiện ra.

Giới kỹ sư đặt tên cho hiện tượng này là **'World Wide Wait'** — chơi chữ với 'World Wide Web'.

Và con số 350ms này không phải lý thuyết — em sẽ demo thực tế ngay sau phần lý thuyết. Còn bên phải màn hình là kết quả **khi có CDN: dưới 50ms** — nhanh hơn 6 đến 8 lần. Đây chính là giá trị mà CDN mang lại."

---

## ─────────────────────────────────────────────────────────
## PHẦN 3 — SLIDE 2: KIẾN TRÚC CDN — PoPs & BGP ANYCAST (2:30 – 4:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Chuyển sang Slide 2 — Sơ đồ luồng PoPs + BGP Anycast

**BẠN:**

"Vậy CDN giải quyết bài toán đó bằng cách nào?

Thay vì 1 máy chủ gốc ở Mỹ phải phục vụ toàn thế giới, CDN xây dựng **hàng ngàn trạm lưu đệm phân tán toàn cầu** — gọi là **PoP: Points of Presence, tạm dịch là Điểm Hiện Diện**.

Nhìn vào sơ đồ ở slide: khi người dùng tại Hà Nội gửi request, giao thức **BGP Anycast** — Border Gateway Protocol Anycast — sẽ tự động định tuyến gói tin về PoP gần nhất về mặt địa lý và vật lý, ví dụ trạm tại TP. Hồ Chí Minh hoặc Singapore.

Tại PoP đó đã lưu sẵn bản copy của website rồi — gọi là **Cached Content**. Edge Server phản hồi ngay lập tức, không cần chạm đến Origin Server tại Mỹ nữa.

Điểm hay của BGP Anycast là: cùng một địa chỉ IP có thể được quảng bá từ hàng trăm trạm PoP khác nhau trên thế giới — router tại Việt Nam sẽ tự tìm đường ngắn nhất và gửi gói tin vào đó.

Đây là lý do vì sao CDN xóa bỏ hoàn toàn bài toán khoảng cách địa lý."

---

## ─────────────────────────────────────────────────────────
## PHẦN 4 — SLIDE 3: 4 LỢI ÍCH SỐNG CÒN (4:00 – 6:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Chuyển sang Slide 3 — 4 lợi ích: Hiệu suất / Sẵn sàng / Mở rộng / Bảo mật

**BẠN:**

"CDN không chỉ giải quyết tốc độ — nó mang lại 4 lợi ích sống còn mà mọi hệ thống lớn đều phụ thuộc vào.

**Thứ nhất, Hiệu suất — Performance.** TTFB từ 350ms xuống dưới 50ms. Ngoài ra CDN còn tự động nén ảnh sang định dạng WebP, minify CSS/JS, và tối ưu các chỉ số Core Web Vitals — ảnh hưởng trực tiếp đến xếp hạng SEO trên Google.

**Thứ hai, Độ sẵn sàng — Availability.** Kịch bản thực tế: 3 giờ sáng, máy chủ Origin bị mất điện đột ngột. Nếu không có CDN, toàn bộ website sập. Nhưng nếu có CDN, các Edge PoP vẫn tiếp tục phục vụ bản **Stale Cache** — bản đệm cũ — cho người dùng. Người dùng không hề hay biết sự cố đang xảy ra. Đây gọi là **SLA 99.99%** — tức là chỉ cho phép sập tối đa 52 phút mỗi năm.

**Thứ ba, Khả năng mở rộng — Scalability.** Ngày 11/11 flash sale: lưu lượng tăng vọt 1000 lần trong vài giây. CDN hấp thụ **đến 90% số request** trước khi chúng chạm tới Origin Server — máy gốc không bị quá tải.

**Thứ tư, Bảo mật — Security.** CDN là tấm khiên hấp thụ tấn công **DDoS — Distributed Denial of Service**. Thay vì một máy chủ phải chịu toàn bộ dòng traffic độc hại, hàng trăm PoP phân tán cùng gánh — không PoP nào bị quá tải. Ngoài ra CDN tích hợp **WAF — Web Application Firewall** chặn SQL Injection, XSS ngay tại biên mạng."

---

## ─────────────────────────────────────────────────────────
## PHẦN 5 — SLIDE 4: THỊ TRƯỜNG CDN TOÀN CẦU (6:00 – 8:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Chuyển sang Slide 4 — Các nền tảng: Cloudflare / Akamai / AWS CloudFront / Fastly

**BẠN:**

"Thị trường CDN toàn cầu hiện được thống trị bởi 4 tên tuổi lớn — mỗi cái phù hợp cho một nhóm đối tượng khác nhau.

**Cloudflare** — được coi là 'ngọn cờ đầu' cho developer và startup. Mô hình Freemium cực hấp dẫn: gói miễn phí cực mạnh, chỉ cần trỏ nameserver DNS là xong. WAF chống DDoS không giới hạn, Edge Workers cho phép chạy logic JavaScript ngay tại biên mạng mà không cần server.

**Akamai** — gã khổng lồ lâu đời nhất, tồn tại từ 1998. Hơn 4.000 PoP toàn cầu. Không có đối thủ trong lĩnh vực Media Streaming quy mô cực lớn — World Cup, Netflix, các ngân hàng lớn đều phụ thuộc vào Akamai. Nhưng hợp đồng Enterprise cực đắt và phức tạp, không phù hợp cho dự án nhỏ.

**AWS CloudFront** — ra đời trong hệ sinh thái Amazon, tích hợp hoàn toàn với S3, Lambda, EC2. Lý tưởng nếu dự án đang chạy trên AWS rồi. Tuy nhiên cước phí thả nổi theo băng thông, có rủi ro hóa đơn bùng nổ nếu cấu hình sai.

**Fastly và nhóm Frontend CDN — Vercel, Netlify** — đây là nhóm tối ưu cho lập trình Frontend hiện đại. Và quan trọng nhất: **Github Pages chính là đang dùng Fastly làm CDN.** Tức là dự án Demo của em, khi deploy lên Github Pages, sẽ có sẵn tốc độ Edge của Fastly — không cần cấu hình thêm gì.

Em sẽ chứng minh điều này ngay trong phần Demo sau đây."

---

## ─────────────────────────────────────────────────────────
## PHẦN 6 — WEB DEMO 1: ĐO TTFB LOCAL vs CDN (8:00 – 11:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **CHUYỂN MÀN HÌNH:** Alt+Tab sang Tab 1 trình duyệt — `file:///d:/doc/cdn_demo/index.html`
> *(Dashboard tự động đo lường, banner đỏ/vàng hiện ra với chỉ số ~300ms)*

**BẠN:**

"Bắt đầu phần Demo. Em tắt slide và chuyển sang trình duyệt.

Đây là ứng dụng **'CDN Performance Analyzer'** mà em tự thiết kế và lập trình. Không có số liệu nào được hard-code hay giả lập — toàn bộ là dữ liệu đo thật theo thời gian thực từ máy tính của em ngay lúc này.

Giao diện hiện tại là phiên bản chạy từ ổ cứng cục bộ — URL bắt đầu bằng `file://`. Điều này có nghĩa là: không qua bất kỳ máy chủ hay CDN nào cả.

Vì chạy từ `file://`, trình duyệt chặn hoàn toàn lệnh `fetch()` do chính sách bảo mật CORS. Hệ thống của em xử lý vấn đề này bằng kỹ thuật **Image Probes** — thay vì gọi API, em tạo thẻ `<img>` ẩn trỏ đến 3 server gốc tại Mỹ: HTTPBin tại Virginia, Ipify tại Oregon, và Ident.me tại California. Trình duyệt vẫn thực hiện kết nối mạng để tải ảnh — và em dùng **Resource Timing API** để bắt thời gian đó.

Nhìn vào kết quả: TTFB trung bình khoảng **[đọc số trên màn hình]ms** — đây là thời gian thực tế để gói tin từ máy em vượt đại dương sang Mỹ và nhận được phản hồi đầu tiên.

---

*(Bấm nút "🔄 Phân tích lại" 1 lần)*

Em bấm đo lại để chứng minh tính nhất quán — con số vẫn duy trì ở mức cao, vì bản chất vật lý của khoảng cách địa lý không thay đổi.

---

*(Alt+Tab sang Tab 2: `https://chimpk.github.io/cdn-demo-midterm/`)*

Bây giờ em chuyển sang Tab 2 — đây là **cùng một ứng dụng**, nhưng đã được deploy lên Github Pages. URL là `chimpk.github.io/cdn-demo-midterm`.

Nhìn vào Dashboard — màu xanh ngay lập tức! TTFB chỉ còn khoảng **[đọc số]ms** — nhanh hơn **[X] lần** so với phiên bản local.

Vì sao? Lần này không còn chạy `file://` nữa — hệ thống dùng **Fetch API** kết hợp **Resource Timing API** để đo TTFB chính xác. Công thức: `TTFB = responseStart - fetchStart` — tức là từ lúc bắt đầu kết nối đến lúc nhận byte dữ liệu đầu tiên, bao gồm cả DNS lookup, TCP handshake, và TLS.

Và đặc biệt, ô **CF-Cache-STATUS** bên dưới báo **[đọc giá trị]** — đây là response header mà Fastly CDN gửi kèm trong mỗi response, cho biết dữ liệu được lấy từ Cache Edge hay phải kéo về từ Origin."

---

## ─────────────────────────────────────────────────────────
## PHẦN 7 — WEB DEMO 2: CACHE INVALIDATION (11:00 – 12:30)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Vẫn giữ Tab 2 Github Pages — Click nút **"🚀 Cập nhật App (Invalidation)"**
> *(Banner vàng hiện: Cache Busting v2.0 — Dashboard tự động đo lại)*

**BẠN:**

"Bây giờ em tiến hành thực nghiệm thứ hai — demo kỹ thuật **Cache Invalidation**.

Đây là bài toán thực tế: em vừa push code mới lên server. Nhưng CDN đang cache phiên bản cũ tại hàng trăm PoP. Làm sao để người dùng nhận được bản mới ngay lập tức?

Em bấm nút **'Cập nhật App (Invalidation)'** — tương đương với việc deploy phiên bản mới.

---

*(Bấm nút, quan sát)*

Nhìn vào URL trong logic hệ thống: trước đây URL là `...index.html`, giờ hệ thống tự động thêm query string `?_v=2`. Đây là kỹ thuật gọi là **Cache Busting**.

CDN phân biệt tài nguyên theo URL chính xác — URL mới đồng nghĩa với tài nguyên chưa có trong Cache. Vì vậy, CDN buộc phải quay về **Origin Server** để kéo phiên bản mới nhất.

Kết quả: TTFB **vọt lên cao** — đây là trạng thái **Cache MISS**. Màu vàng cảnh báo. Banner hiện 'CDN Cache Miss — Đang kéo v2.0'.

---

*(Đợi Dashboard render xong, rồi bấm nút '🔄 Phân tích lại')*

Bây giờ em bấm đo lại lần thứ hai...

Và ngay lập tức — TTFB giảm mạnh, màu **xanh trở lại**! Vì sau lần kéo đầu tiên đó, CDN đã lưu phiên bản v2 vào Cache của PoP gần em nhất. Những người dùng tiếp theo không cần chờ nữa — nhận HIT ngay.

Đây chính là **vòng đời của Cache Invalidation**: Invalidate → MISS → CDN warm-up → HIT. Không có Invalidation, người dùng sẽ bị kẹt mãi với phiên bản cũ — gọi là **Stale Data**."

---

## ─────────────────────────────────────────────────────────
## PHẦN 8 — SLIDE 7: 4 PHƯƠNG PHÁP INVALIDATION (12:30 – 14:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **CHUYỂN MÀN HÌNH:** Alt+Tab về slide → Slide 7 — "4 Phương pháp Invalidation"

**BẠN:**

"Quay lại slide — em vừa demo kỹ thuật Cache Busting. Nhưng trong thực tế sản xuất, đội ngũ kỹ thuật có **4 phương pháp Invalidation** chính mà cần phải nắm rõ — vì mỗi tình huống cần dùng cách khác nhau.

**Phương pháp 1 — TTL Expiry.** Đây là cách đơn giản nhất: gắn vòng đời vào tài nguyên qua header `Cache-Control: max-age=86400` — tức 24 giờ. Khi hết thời gian, Edge Server tự đánh dấu Cache là 'stale' và gửi yêu cầu revalidate về Origin. Nếu nội dung chưa thay đổi, Origin trả mã `304 Not Modified` — Edge tiếp tục dùng bản cũ mà không cần tải lại. Phù hợp cho tài nguyên ít thay đổi như ảnh, font chữ.

**Phương pháp 2 — Purge API.** Khi có sự cố khẩn cấp — ví dụ đăng nhầm thông tin nhạy cảm — kỹ sư gọi thẳng API của nhà cung cấp CDN để xóa Cache tức thì trên toàn cầu. Có 3 mức: xóa theo URL cụ thể, xóa theo Cache-Tag để xóa cả nhóm tài nguyên cùng loại, hoặc Purge Everything — quét toàn bộ, nhưng dùng cẩn thận vì sẽ gây tăng đột biến lưu lượng về Origin.

**Phương pháp 3 — Cache Busting.** Đúng như em vừa demo — thêm `?_v=2` vào URL. Vì CDN lưu Cache theo URL chính xác, URL mới = tài nguyên hoàn toàn mới, không bao giờ có HIT cũ. Phù hợp nhất khi deploy JavaScript và CSS mới.

**Phương pháp 4 — Stale-While-Revalidate.** Đây là chiến lược thông minh nhất: Header `Cache-Control: stale-while-revalidate=60` ra lệnh cho Edge vừa trả bản cũ ngay lập tức cho người dùng — đảm bảo tốc độ — vừa đồng thời âm thầm gửi request cập nhật bản mới từ Origin ở nền. Người dùng tiếp theo nhận HIT với bản mới. Cân bằng hoàn hảo giữa tốc độ và độ tươi mới — phù hợp cho API công khai và tin tức."

---

## ─────────────────────────────────────────────────────────
## PHẦN 9 — SLIDE 8: KẾT LUẬN (14:00 – 15:00)
## ─────────────────────────────────────────────────────────

> 🖥️ **MÀN HÌNH:** Chuyển sang Slide 8 — Kết luận cuối

**BẠN:**

"Slide cuối cùng — tổng kết những gì em vừa trình bày.

Qua 2 thực nghiệm trực tiếp, em đã chứng minh bằng số liệu thực tế:

Một là: **TTFB giảm từ khoảng 300ms xuống dưới 50ms** khi có CDN Edge — nhanh hơn 6 đến 8 lần — không phải lý thuyết, là số đo thật ngay trên màn hình.

Hai là: **Cache Invalidation là kỹ thuật không thể thiếu** trong vận hành hệ thống CDN — với 4 chiến lược: TTL tự nhiên, Purge API khẩn cấp, Cache Busting khi deploy code, và Stale-While-Revalidate cho cân bằng tốc độ.

Nhìn vào câu kết trên slide: *'Thế giới lập trình mạng đã không còn nằm ở lõi Trung tâm — mà dời trọn sức mạnh ra Edge Computing thông qua các Caching Points phân tán toàn cầu.'*

CDN không còn là công nghệ xa xỉ của doanh nghiệp lớn — Github Pages miễn phí đã có Fastly, Netlify miễn phí đã có Edge Network. Sinh viên lập trình web ngày nay hoàn toàn có thể deploy ứng dụng với tốc độ toàn cầu mà không tốn một đồng hạ tầng nào.

Link demo trực tiếp: `chimpk.github.io/cdn-demo-midterm` — Thầy/Cô và các bạn có thể truy cập ngay để tự đo TTFB từ máy của mình.

Em xin kết thúc. Cảm ơn Thầy/Cô và các bạn đã theo dõi! 🙏"

---

## 📋 BẢNG TÓM TẮT HÀNH ĐỘNG THEO THỜI GIAN

| Thời gian | Màn hình | Lời nói chính | Hành động |
|---|---|---|---|
| 0:00 | Slide 0 (Trang bìa) | Chào, giới thiệu tên, đề tài 8 | Nhìn camera, mỉm cười |
| 0:40 | Slide 1 (World Wide Wait) | "Bài toán vật lý — cáp quang biển — 350ms" | Chỉ vào số đỏ vs xanh |
| 2:30 | Slide 2 (Kiến trúc PoPs) | "BGP Anycast định tuyến tới PoP gần nhất" | Chỉ vào sơ đồ luồng |
| 4:00 | Slide 3 (4 lợi ích) | "4 lợi ích: Hiệu suất / Sẵn sàng / Mở rộng / Bảo mật" | Đọc từng card |
| 6:00 | Slide 4 (Nhà cung cấp) | "Github Pages dùng Fastly — Demo dùng CDN này" | Nhấn mạnh Fastly |
| 8:00 | **Tab 1 – Local `file://`** | "Image Probes vượt CORS — đo thật ~300ms" | Để Dashboard tự chạy |
| 9:00 | Tab 1 – Bấm Phân tích lại | "Tính nhất quán — vẫn cao" | Click 1 lần |
| 9:30 | **Tab 2 – Github Pages** | "Cùng ứng dụng — qua Fastly CDN — <50ms" | Alt+Tab |
| 10:30 | Tab 2 – đọc Cache Header | "HIT — bằng chứng Edge đang phục vụ" | Trỏ vào ô CF-CACHE |
| 11:00 | Tab 2 – Bấm Cập nhật App | "Cache Busting ?_v=2 — URL mới — CDN không có HIT" | Click nút Invalidation |
| 11:30 | Tab 2 – Dashboard báo MISS | "TTFB cao — CDN đang kéo từ Origin" | Đọc số MISS |
| 12:00 | Tab 2 – Bấm Phân tích lại | "Lần 2 — HIT — CDN đã warm-up xong" | Click lại |
| 12:30 | **Slide 7 (4 Invalidation)** | "4 cách: TTL / Purge API / Cache Busting / SWR" | Alt+Tab về slide |
| 14:00 | **Slide 8 (Kết luận)** | "300ms → 50ms thực tế — Edge Computing tương lai" | Nhìn camera, kết thúc |

---

## 💡 GHI CHÚ KỸ THUẬT KHI QUAY

- **Nếu TTFB CDN cao bất thường (>150ms):** Do Cache COLD — bấm "Phân tích lại" 1 lần để warm up, rồi đọc lần thứ 2.
- **Nếu Dashboard không tự load:** Bấm nút "🔄 Phân tích lại" thủ công.
- **Nếu CF-Cache-STATUS báo N/A trên Github Pages:** Fastly dùng header `X-Cache` thay vì `CF-Cache-Status` — hệ thống đã xử lý cả hai, chỉ là Fastly không phải Cloudflare nên header khác tên.
- **Tốc độ đọc lý tưởng:** 130–140 từ/phút, không đọc nhanh hơn. Dừng 0.5 giây sau mỗi ý chính.

