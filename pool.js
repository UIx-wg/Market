// Real API integration for pool status
async function fetchPoolStatus() {
    const res = await fetch('/api/pool/status');
    const data = await res.json();
    document.getElementById('block-number').textContent = data.blockNumber;
    document.getElementById('block-hash').textContent = data.blockHash;
    document.getElementById('mining-status').textContent = data.miningStatus;
}

async function regenBlock() {
    const res = await fetch('/api/pool/regenerate', { method: "POST" });
    const data = await res.json();
    document.getElementById('block-number').textContent = data.blockNumber;
    document.getElementById('block-hash').textContent = data.blockHash;
    document.getElementById('mining-status').textContent = data.miningStatus;
}

async function autoRegenerate() {
    await fetchPoolStatus();
    setTimeout(autoRegenerate, 4000);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPoolStatus();
    autoRegenerate();
    // Block Explorer search:
    document.getElementById('explorer-search').addEventListener('input', async e => {
        let val = e.target.value.trim();
        let resultDiv = document.getElementById('explorer-results');
        if (!val) return resultDiv.innerHTML = '';
        const res = await fetch('/api/explorer/search?q=' + encodeURIComponent(val));
        const data = await res.json();
        if (!data.found) {
            resultDiv.innerHTML = `<span style="color:#d13b7b">Not found in current block/hash</span>`;
        } else if (data.type === 'block') {
            resultDiv.innerHTML = `<b>Block ${data.blockNumber}</b>: Current block, hash <span style="font-size:0.95em">${data.blockHash.slice(0,16)}...</span>`;
        } else if (data.type === 'hash') {
            resultDiv.innerHTML = `<b>Hash found:</b> <span style="font-size:0.95em">${data.blockHash}</span> (Block ${data.blockNumber})`;
        }
    });
});