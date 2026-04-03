document.addEventListener("DOMContentLoaded", () => {
    // 1. Fetch Version Metadata
    const versionMeta = document.querySelector('meta[name="app-version"]');
    const versionDisplay = document.querySelector('#version-display span');
    if (versionMeta && versionDisplay) {
        versionDisplay.textContent = versionMeta.getAttribute('content');
    }

    // 2. Performance Analysis (Wait for full load to get accurate timings)
    window.addEventListener('load', () => {
        setTimeout(() => {
            analyzeNetwork();
        }, 100);
    });

    // 3. Check Custom Headers
    checkHeaders();
});

function analyzeNetwork() {
    const navEntries = window.performance.getEntriesByType("navigation");
    
    if (navEntries.length > 0) {
        const perfData = navEntries[0];
        
        // TTFB Calculation: ResponseStart - RequestStart
        const ttfb = perfData.responseStart - perfData.requestStart;
        const formattedTTFB = Math.max(0, ttfb).toFixed(2);
        
        const ttfbCard = document.getElementById("ttfb-card");
        const ttfbValue = document.getElementById("ttfb-value");
        const ttfbStatus = document.getElementById("ttfb-status");
        
        const edgeStatusValue = document.getElementById("edge-status");
        const edgeDescText = document.getElementById("edge-desc");
        
        ttfbValue.textContent = `${formattedTTFB} ms`;

        const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost" || window.location.protocol === "file:";

        if (isLocal) {
            ttfbStatus.textContent = "Môi trường Local (Bỏ qua)";
            ttfbStatus.className = "metric-status status-warning";
            ttfbCard.classList.add("border-warning");
            
            edgeStatusValue.textContent = "Máy Tính Cá Nhân";
            edgeStatusValue.className = "metric-value status-warning";
            edgeDescText.textContent = "App đang chạy thẳng từ ổ cứng Localhost, không có độ trễ mạng Internet.";
        } else if (formattedTTFB > 300) {
            ttfbStatus.textContent = "Chậm/Ping dội cao (Miss)";
            ttfbStatus.className = "metric-status status-danger";
            ttfbCard.classList.add("border-danger");
            
            edgeStatusValue.textContent = "Máy Chủ Gốc";
            edgeStatusValue.className = "metric-value status-danger";
            edgeDescText.textContent = "Tải trực tiếp ở rùa từ Máy chủ trung tâm (Origin).";
        } else if (formattedTTFB < 100) {
            ttfbStatus.textContent = "Siêu Tốc (Cache Hit)";
            ttfbStatus.className = "metric-status status-success";
            ttfbCard.classList.add("border-success");
            
            edgeStatusValue.textContent = "Trạm CDN (PoPs)";
            edgeStatusValue.className = "metric-value status-success";
            edgeDescText.textContent = "Nhận phản hồi lập tức từ trạm CDN biên chi nhánh gần nhất.";
        } else {
            ttfbStatus.textContent = "Mạng Chuyển Tiếp (Warning)";
            ttfbStatus.className = "metric-status status-warning";
            
            edgeStatusValue.textContent = "Mạng hỗn hợp";
            edgeStatusValue.className = "metric-value status-warning";
            edgeDescText.textContent = "Khả năng cao đang ở luồng định tuyến proxy hỗn hợp.";
        }
    } else {
        document.getElementById("ttfb-status").textContent = "Trình duyệt không cập nhật API TTFB.";
    }
}

async function checkHeaders() {
    try {
        const response = await fetch('css/style.css', { method: 'HEAD' });
        const cfCacheStatus = response.headers.get('cf-cache-status');
        const awsCacheStatus = response.headers.get('x-cache');
        
        const hitStatusValue = document.getElementById("cache-hit-status");
        
        if (cfCacheStatus || awsCacheStatus) {
            const statusText = cfCacheStatus || awsCacheStatus;
            hitStatusValue.textContent = statusText;
            hitStatusValue.className = statusText.includes('HIT') ? "metric-value status-success" : "metric-value status-warning";
        } else {
            hitStatusValue.innerHTML = "Not Detected<br><span style='font-size: 1rem; color: var(--text-muted);'>Chưa đánh chặn/Local</span>";
            hitStatusValue.className = "metric-value status-warning";
        }
    } catch(err) {
        console.warn("Could not fetch header stats");
    }
}

function simulateOrigin() {
    const fakeTTFB = (Math.random() * (350 - 280) + 280).toFixed(2);
    
    const ttfbValue = document.getElementById("ttfb-value");
    const ttfbStatus = document.getElementById("ttfb-status");
    const ttfbCard = document.getElementById("ttfb-card");
    const edgeStatusValue = document.getElementById("edge-status");
    const edgeDescText = document.getElementById("edge-desc");
    const hitStatusValue = document.getElementById("cache-hit-status");
    
    // Đổ đỏ toàn bộ khối UI
    ttfbValue.textContent = `${fakeTTFB} ms`;
    
    ttfbStatus.textContent = "Chậm/Ping dội cao (Miss)";
    ttfbStatus.className = "metric-status status-danger";
    ttfbCard.className = "metric-card glass border-danger";
    
    edgeStatusValue.textContent = "Máy Chủ Gốc";
    edgeStatusValue.className = "metric-value status-danger";
    edgeDescText.textContent = "Tải trực tiếp ở rùa từ Máy chủ trung tâm (Origin) bên kia Đại dương.";
    
    hitStatusValue.textContent = "MISS / BYPASS";
    hitStatusValue.className = "metric-value status-danger";
}
