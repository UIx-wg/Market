// Fetch crypto list from backend API
let cryptos = [];

function renderTable(cryptoList) {
    const tbody = document.getElementById('crypto-rows');
    tbody.innerHTML = '';
    cryptoList.forEach((c, idx) => {
        const row = document.createElement('div');
        row.className = 'crypto-row';
        row.innerHTML = `
            <div>${c.name}</div>
            <div>${c.symbol}</div>
            <div>$${c.price.toLocaleString(undefined, {maximumFractionDigits: 8})}</div>
            <div style="color:${c.change>=0?'#31b94e':'#d13b7b'}">${c.change>0?'+':''}${c.change}%</div>
            <div>${c.marketCap}</div>
        `;
        tbody.appendChild(row);
    });
}

function filterCryptos() {
    const query = document.getElementById('search').value.toLowerCase();
    const filtered = cryptos.filter(c => c.name.toLowerCase().includes(query) || c.symbol.toLowerCase().includes(query));
    renderTable(filtered);
}

async function fetchMarket() {
    const res = await fetch('/api/market');
    cryptos = await res.json();
    renderTable(cryptos);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMarket();
    document.getElementById('search').addEventListener('input', filterCryptos);
});