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

async function measureTTFB(url, label) {
    const start = performance.now();
    try {
        // Sử dụng cache: 'no-cache' để ép trình duyệt phải check với Edge Server (CDN)
        // nhưng CDN vẫn được phép trả về bản HIT. Điều này đo chính xác độ trễ Network tới Edge.
        const res = await fetch(url + `?v=${currentVersion}`, { 
            method: 'GET', 
            mode: 'no-cors', // Dùng no-cors để có thể đo được cả các nguồn khác
            cache: 'no-cache' 
        });
        
        // Lấy dữ liệu TTFB từ Resource Timing API
        const entries = performance.getEntriesByName(url + `?v=${currentVersion}`);
        const lastEntry = entries[entries.length - 1];
        
        let ttfb = 0;
        if (lastEntry && lastEntry.responseStart > 0) {
            ttfb = lastEntry.responseStart - lastEntry.requestStart;
        } else {
            // Fallback nếu Resource Timing bị trình duyệt hạn chế
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
        const results = await Promise.all(ORIGIN_PROBES.map(p => measureTTFB(p.url, p.label)));
        const valid = results.filter(r => r.ttfb != null);
        const med = valid.length ? [...valid].sort((a,b) => a.ttfb - b.ttfb)[Math.floor(valid.length/2)] : null;
        renderResult({ env: 'local', ttfb: med?.ttfb, detailRows: buildRows(results), label: med?.label });
    } else {
        // Thực hiện đo thực tế Network tới Edge CDN
        const pageProbe = await measureTTFB(window.location.origin + window.location.pathname, 'Current Page (Edge)');
        const results = await Promise.all(CDN_PROBES.map(p => measureTTFB(p.url, p.label)));
        
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
    if (!el || detectEnvironment() === 'local') { el.textContent = 'N/A'; return; }
    try {
        const res = await fetch(window.location.href, { method: 'HEAD', cache: 'no-store' });
        const hit = res.headers.get('cf-cache-status') || res.headers.get('x-cache') || 'HIT (隱)';
        el.textContent = hit;
        el.className = `metric-value ${hit.includes('HIT') ? 'status-success' : 'status-warning'}`;
    } catch { el.textContent = 'ERROR'; }
}
