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

        if (formattedTTFB > 300) {
            ttfbStatus.textContent = "High latency - Cache Miss";
            ttfbStatus.className = "metric-status status-danger";
            ttfbCard.classList.add("border-danger");
            
            edgeStatusValue.textContent = "Origin Server";
            edgeStatusValue.className = "metric-value status-danger";
            edgeDescText.textContent = "Request served directly from central server.";
        } else if (formattedTTFB < 100) {
            ttfbStatus.textContent = "Ultra Low latency - Cache Hit";
            ttfbStatus.className = "metric-status status-success";
            ttfbCard.classList.add("border-success");
            
            edgeStatusValue.textContent = "Edge CDN (PoPs)";
            edgeStatusValue.className = "metric-value status-success";
            edgeDescText.textContent = "Served instantly from the nearest Edge location.";
        } else {
            ttfbStatus.textContent = "Average Latency";
            ttfbStatus.className = "metric-status status-warning";
            
            edgeStatusValue.textContent = "Intermediate";
            edgeStatusValue.className = "metric-value status-warning";
            edgeDescText.textContent = "Network path is being heavily routed.";
        }
    } else {
        document.getElementById("ttfb-status").textContent = "Navigation Timing API not supported.";
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
            hitStatusValue.innerHTML = "Not Detected<br><span style='font-size: 1rem; color: var(--text-muted);'>No CDN proxy</span>";
            hitStatusValue.className = "metric-value status-warning";
        }
    } catch(err) {
        console.warn("Could not fetch header stats");
    }
}
