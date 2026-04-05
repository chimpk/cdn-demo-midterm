let currentVersion = 1;

document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('load', () => setTimeout(runAnalysis, 200));
});

const ORIGIN_PROBES = [
    { url: 'https://httpbin.org/get', label: 'HTTPBin (US-Virginia)' },
    { url: 'https://api.ipify.org', label: 'Ipify API (US-Oregon)' },
    { url: 'https://ident.me', label: 'Ident (US-California)' }
];

const CDN_PROBES = [
    { url: 'https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js', label: 'jsDelivr (Fastly SEA)' },
    { url: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js', label: 'cdnjs (Cloudflare SEA)' }
];

function detectEnvironment() {
    const proto = window.location.protocol;
    const host  = window.location.hostname;
    return (proto === 'file:' || host === 'localhost' || host === '127.0.0.1') ? 'local' : 'cdn';
}

function simulateUpdate() {
    currentVersion++;
    const banner = document.getElementById('env-banner');
    banner.style.cssText = 'background:rgba(255,193,7,0.1);color:#ffc107;border:1px solid #ffc10744;border-radius:12px;padding:1rem;margin-bottom:1rem;';
    banner.innerHTML = `<strong>🚀 CACHE BUSTING (v${currentVersion}.0)</strong><br><small>Thêm query string (?v=${currentVersion}) vào URL để ép CDN tải lại từ Origin — mô phỏng kịch bản Invalidation.</small>`;
    setTimeout(runAnalysis, 1500);
}

// ===== Đo latency qua Image Probe (vượt CORS & file://) =====
function measureViaImage(url, label) {
    return new Promise((resolve) => {
        const cacheBust = Date.now() + '_' + Math.random().toString(36).slice(2);
        const sep = url.includes('?') ? '&' : '?';
        const fullUrl = url + sep + '_nc=' + cacheBust;
        const start = performance.now();
        let resolved = false;

        const finish = () => {
            if (resolved) return;
            resolved = true;
            const elapsed = performance.now() - start;
            // Thử Resource Timing API để có số liệu chính xác hơn
            const entries = performance.getEntriesByName(fullUrl);
            const entry = entries[entries.length - 1];
            let latency;
            if (entry && entry.responseStart > 0) {
                // TTFB chính xác (chỉ khi server gửi Timing-Allow-Origin)
                latency = entry.responseStart - entry.requestStart;
            } else if (entry && entry.duration > 0) {
                // Cross-origin không có TAO → dùng duration ≈ Network RTT
                latency = entry.duration;
            } else {
                // Fallback: tổng thời gian
                latency = elapsed;
            }
            resolve({ label, ttfb: Math.max(0, latency), error: null });
        };

        const img = new Image();
        img.onload = finish;
        img.onerror = finish; // Vẫn đo được thời gian mạng khi lỗi
        img.src = fullUrl;

        // Timeout 10 giây
        setTimeout(() => {
            if (!resolved) { resolved = true; resolve({ label, ttfb: null, error: 'timeout' }); }
        }, 10000);
    });
}

// ===== Đo TTFB qua Fetch API (dùng khi chạy trên HTTPS) =====
// bustCache=true: thêm query string cache-busting (dùng cho same-origin page)
// bustCache=false: giữ URL gốc để CDN trả Cache HIT (dùng cho CDN probes)
async function measureViaFetch(url, label, bustCache = true) {
    let fullUrl;
    if (bustCache) {
        const sep = url.includes('?') ? '&' : '?';
        fullUrl = url + sep + 'v=' + currentVersion + '_' + Date.now();
    } else {
        fullUrl = url;
    }
    const start = performance.now();
    try {
        // HEAD tránh tải toàn bộ file nặng (jQuery ~87KB), chỉ đo RTT
        const method = bustCache ? 'GET' : 'HEAD';
        const res = await fetch(fullUrl, { method, cache: 'no-cache', mode: 'cors' })
            .catch(() => fetch(fullUrl, { method: 'GET', cache: 'no-cache', mode: 'cors' }));
        // Lấy dữ liệu TTFB từ Resource Timing API
        const entries = performance.getEntriesByName(fullUrl);
        const entry = entries[entries.length - 1];
        let ttfb;
        if (entry && entry.responseStart > 0) {
            // TTFB chính xác (cần Timing-Allow-Origin từ server)
            ttfb = entry.responseStart - entry.requestStart;
        } else if (entry && entry.duration > 0) {
            // Cross-origin không có TAO → duration ≈ Network RTT (HEAD nên rất gần TTFB)
            ttfb = entry.duration;
        } else {
            ttfb = performance.now() - start;
        }
        return { label, ttfb: Math.max(0, ttfb), error: null };
    } catch (e) {
        return { label, ttfb: null, error: 'failed' };
    }
}

function getNavigationTTFB() {
    const nav = performance.getEntriesByType('navigation')[0];
    return (nav && nav.responseStart > 0) ? Math.max(0, nav.responseStart - nav.requestStart) : null;
}

async function runAnalysis() {
    const env = detectEnvironment();
    showMeasuring();

    if (env === 'local') {
        // Local: dùng Image Probe để vượt hạn chế file:// và CORS
        const results = await Promise.all(ORIGIN_PROBES.map(p => measureViaImage(p.url, p.label)));
        const valid = results.filter(r => r.ttfb != null);
        const med = valid.length ? [...valid].sort((a,b) => a.ttfb - b.ttfb)[Math.floor(valid.length/2)] : null;
        renderResult({ env: 'local', ttfb: med?.ttfb, detailRows: buildRows(results), label: med?.label });
    } else {
        // CDN: dùng Fetch API trực tiếp (CORS hợp lệ trên HTTPS)
        const pageProbe = await measureViaFetch(window.location.origin + window.location.pathname, 'Current Page (Edge)', true);
        const results = await Promise.all(CDN_PROBES.map(p => measureViaFetch(p.url, p.label, false)));
        
        // Ưu tiên số đo latency thực tế mới nhất
        const currentTTFB = pageProbe.ttfb || getNavigationTTFB();
        
        renderResult({ 
            env: 'cdn', 
            ttfb: currentTTFB, 
            detailRows: buildRows([pageProbe, ...results]), 
            label: 'CDN Edge' 
        });
    }
    fetchCacheHeader();
}

function buildRows(results) {
    return results.map(r => {
        const ms = r.ttfb ? `${r.ttfb.toFixed(1)}ms` : '---';
        const color = r.ttfb ? (r.ttfb < 150 ? '#20c997' : r.ttfb < 250 ? '#ffc107' : '#ff4d4f') : '#888';
        return `<tr><td style="text-align:left;opacity:0.8">${r.label}</td><td style="text-align:right;color:${color};font-weight:600">${ms}</td></tr>`;
    }).join('');
}

function renderResult({ env, ttfb, detailRows, label }) {
    const val = ttfb ? ttfb.toFixed(1) : '---';
    const isSuccess = (env === 'cdn' && ttfb < 100);
    const isWarning = (env === 'cdn' && ttfb >= 100) || (env === 'local' && !ttfb);
    
    const statusClass = isSuccess ? 'status-success' : (isWarning ? 'status-warning' : 'status-danger');
    const borderClass = isSuccess ? 'border-success' : (isWarning ? '' : 'border-danger');

    setDOM({
        ttfbText: `${val} ms`,
        ttfbNote: env === 'local' ? `Median Origin: ${label || 'N/A'}` : 'Phân tích từ CDN Edge PoP',
        ttfbClass: `metric-status ${statusClass}`,
        cardClass: `metric-card glass ${borderClass}`,
        edgeText: env === 'local' ? 'Origin Server' : 'Cloud Network',
        edgeClass: `metric-value ${statusClass}`,
        edgeDesc: env === 'local' ? 'Kết nối trực tiếp tới server gốc US' : 'Đã tối ưu qua CDN Edge',
        bannerType: isSuccess ? 'success' : (isWarning ? 'warning' : 'danger'),
        bannerMsg: env === 'local' ? `Chế độ Local (v${currentVersion}.0) — Chưa có CDN` : (isSuccess ? `CDN Active — Phiên bản v${currentVersion}.0` : `CDN Cache Miss — Đang kéo v${currentVersion}.0`),
        bannerSub: env === 'local' ? 'Dữ liệu đo thực tế từ máy bạn tới Origin Mỹ' : 'Dữ liệu đo trực tiếp qua CDN PoP'
    });
    const card = document.getElementById('ttfb-card');
    card.querySelectorAll('.probe-table').forEach(e => e.remove());
    const table = document.createElement('div');
    table.className = 'probe-table';
    table.style.cssText = 'margin-top:1rem;font-size:0.8rem;border-top:1px solid rgba(255,255,255,0.1);padding-top:0.5rem';
    table.innerHTML = `<table style="width:100%">${detailRows}</table>`;
    card.appendChild(table);
}

function showMeasuring() {
    document.getElementById('ttfb-value').textContent = 'Loading...';
    const banner = document.getElementById('env-banner');
    if (banner) banner.innerHTML = '<strong>Đang đo lường và phân tích gói tin mạng...</strong>';
}

function setDOM(d) {
    document.getElementById('ttfb-value').textContent = d.ttfbText;
    document.getElementById('ttfb-status').textContent = d.ttfbNote;
    document.getElementById('ttfb-status').className = d.ttfbClass;
    document.getElementById('ttfb-card').className = d.cardClass;
    document.getElementById('edge-status').textContent = d.edgeText;
    document.getElementById('edge-status').className = d.edgeClass;
    document.getElementById('edge-desc').textContent = d.edgeDesc;
    const b = document.getElementById('env-banner');
    const c = d.bannerType === 'success' ? {bg:'rgba(32,201,151,0.1)', t:'#20c997'} : (d.bannerType === 'danger' ? {bg:'rgba(255,77,79,0.1)', t:'#ff4d4f'} : {bg:'rgba(255,193,7,0.1)', t:'#ffc107'});
    if(b) {
        b.style.cssText = `background:${c.bg};color:${c.t};border:1px solid ${c.t}44;border-radius:12px;padding:1rem;margin-bottom:1rem;`;
        b.innerHTML = `<strong>${d.bannerMsg}</strong><br><small style="opacity:0.8">${d.bannerSub}</small>`;
    }
}

async function fetchCacheHeader() {
    const el = document.getElementById('cache-hit-status');
    if (!el || detectEnvironment() === 'local') { el.textContent = 'N/A (Local)'; return; }
    try {
        const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const hit = res.headers.get('cf-cache-status')
            || res.headers.get('x-cache')
            || res.headers.get('x-cache-status');
        el.textContent = hit || 'N/A';
        if (hit) {
            el.className = `metric-value ${hit.includes('HIT') ? 'status-success' : 'status-warning'}`;
        }
    } catch { el.textContent = 'N/A'; }
}
