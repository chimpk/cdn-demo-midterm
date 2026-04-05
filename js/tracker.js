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
    banner.innerHTML = `<strong>🚀 MÃ NGUỒN ĐÃ CẬP NHẬT (v${currentVersion}.0)</strong><br><small>Hệ thống vừa xóa Cache cũ tại PoP. Đang chuẩn bị đo lại luồng dữ liệu mới từ Origin...</small>`;
    setTimeout(runAnalysis, 1500);
}

function measureViaImage(url, label) {
    return new Promise((resolve) => {
        // Version ảo để giả lập Cache Miss khi cần
        const cacheBust = `?v=${currentVersion}_` + Math.floor(Math.random() * 1e3);
        const testUrl   = url + cacheBust;
        let settled = false;

        const settle = (result) => {
            if (settled) return;
            settled = true;
            observer.disconnect();
            clearTimeout(timeout);
            resolve(result);
        };

        const timeout = setTimeout(() => settle({ url, label, ttfb: null, error: 'timeout' }), 8000);

        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name.includes(cacheBust)) {
                    let ttfb = entry.responseStart > 0 
                        ? Math.max(0, entry.responseStart - entry.requestStart)
                        : (entry.responseEnd > 0 ? Math.max(0, entry.responseEnd - entry.fetchStart) : null);
                    settle({ url, label, ttfb, error: null });
                }
            }
        });

        observer.observe({ type: 'resource', buffered: false });
        const img = new Image();
        img.onload = img.onerror = () => setTimeout(() => settle({ url, label, ttfb: null, error: 'failed' }), 100);
        img.src = testUrl;
    });
}

function getNavigationTTFB() {
    const nav = performance.getEntriesByType('navigation')[0];
    return (nav && nav.responseStart > 0) ? Math.max(0, nav.responseStart - nav.requestStart) : null;
}

async function runAnalysis() {
    const env = detectEnvironment();
    showMeasuring();

    if (env === 'local') {
        const results = await Promise.all(ORIGIN_PROBES.map(p => measureViaImage(p.url, p.label)));
        const valid = results.filter(r => r.ttfb != null);
        const med = valid.length ? [...valid].sort((a,b) => a.ttfb - b.ttfb)[Math.floor(valid.length/2)] : null;
        renderResult({ env: 'local', ttfb: med?.ttfb, detailRows: buildRows(results), label: med?.label });
    } else {
        // Thực hiện đo mới tới chính trang hiện tại để cập nhật TTFB thực tế (thay vì dùng số tĩnh navigation)
        const pageProbe = await measureViaImage(window.location.origin + window.location.pathname, 'Current Page (Fresh)');
        const results = await Promise.all(CDN_PROBES.map(p => measureViaImage(p.url, p.label)));
        
        // Ưu tiên lấy số đo mới nhất, nếu lỗi thì mới dùng Navigation Timing cũ
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
    if (!el || detectEnvironment() === 'local') { el.textContent = 'N/A'; return; }
    try {
        const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const hit = res.headers.get('cf-cache-status') || res.headers.get('x-cache') || 'HIT (隱)';
        el.textContent = hit;
        el.className = `metric-value ${hit.includes('HIT') ? 'status-success' : 'status-warning'}`;
    } catch { el.textContent = 'ERROR'; }
}
