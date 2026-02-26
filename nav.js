/**
 * Shared navigation bar component for all pages.
 * Usage: call renderNav('items') or renderNav('doc-scanner') in your page's init.
 */

// Key obfuscation (shared across pages)
function encodeKey(key) {
    return 'x' + btoa(key).split('').reverse().join('');
}

function decodeKey(encoded) {
    if (!encoded || encoded[0] !== 'x') return null;
    try {
        return atob(encoded.slice(1).split('').reverse().join(''));
    } catch { return null; }
}

// Check URL for shared key parameter
function checkUrlKey() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedKey = urlParams.get('k');
    if (encodedKey) {
        const decodedKey = decodeKey(encodedKey);
        if (decodedKey) {
            localStorage.setItem('gemini_api_key', decodedKey);
            window.history.replaceState({}, '', window.location.pathname);
            return decodedKey;
        }
    }
    return null;
}

// Get current API key
function getApiKey() {
    return localStorage.getItem('gemini_api_key') || '';
}

// Render global navigation bar
function renderNav(activePage) {
    // Check URL key first
    checkUrlKey();

    const apiKey = getApiKey();
    const isConfigured = !!apiKey;

    const nav = document.createElement('nav');
    nav.className = 'global-nav';
    nav.id = 'globalNav';
    nav.innerHTML = `
        <img src="logo.png" alt="Logo" class="nav-logo">
        <div class="nav-items">
            <a href="index.html" class="nav-item ${activePage === 'items' ? 'active' : ''}" title="物品管理">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
                <span>物品</span>
            </a>
            <a href="doc-scanner.html" class="nav-item ${activePage === 'doc-scanner' ? 'active' : ''}" title="证件识别">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="16" rx="2"/>
                    <path d="M7 8h4M7 12h10M7 16h6"/>
                </svg>
                <span>证件</span>
            </a>
        </div>
        <div class="nav-spacer"></div>
        <div class="nav-apikey">
            <button class="nav-apikey-toggle ${isConfigured ? 'configured' : ''}" id="navApiKeyToggle" title="API Key 配置">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.78 7.78 5.5 5.5 0 017.78-7.78zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
                <span style="font-size:8px;">API</span>
            </button>
        </div>
        <div class="nav-apikey-panel" id="navApiKeyPanel">
            <h3>Gemini API Key</h3>
            <input type="password" id="navApiKeyInput" placeholder="输入 Gemini API Key"
                   autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                   value="${isConfigured ? apiKey : ''}">
            <button class="nav-key-save" id="navApiKeySave">保存</button>
            <div class="nav-key-status ${isConfigured ? 'configured' : ''}" id="navApiKeyStatus">
                ${isConfigured ? '✓ 已配置' : '未配置'}
            </div>
            <div class="nav-key-link">
                <a href="https://aistudio.google.com/app/apikey" target="_blank">获取 API Key →</a>
            </div>
        </div>
    `;

    // Insert nav as first child of app-shell
    const appShell = document.querySelector('.app-shell');
    if (appShell) {
        appShell.insertBefore(nav, appShell.firstChild);
    } else {
        document.body.insertBefore(nav, document.body.firstChild);
    }

    // Event listeners
    const toggle = document.getElementById('navApiKeyToggle');
    const panel = document.getElementById('navApiKeyPanel');
    const saveBtn = document.getElementById('navApiKeySave');
    const input = document.getElementById('navApiKeyInput');
    const status = document.getElementById('navApiKeyStatus');

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('open');
    });

    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('open');
        }
    });

    saveBtn.addEventListener('click', () => {
        const key = input.value.trim();
        if (!key) return;
        localStorage.setItem('gemini_api_key', key);
        status.textContent = '✓ 已配置';
        status.className = 'nav-key-status configured';
        toggle.classList.add('configured');
        panel.classList.remove('open');

        // Dispatch event for pages to react
        window.dispatchEvent(new CustomEvent('apikey-changed', { detail: { key } }));
    });

    input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });

    // Auto-open API key panel on first visit (no key configured)
    if (!isConfigured) {
        setTimeout(() => panel.classList.add('open'), 300);
    }
}
