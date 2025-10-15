const express = require('express');
const cors = require('cors');
const path = require('path');

// Demo in-memory values for mining pool
let blockNumber = 1002456;
let blockHash = randomHex(64);
let miningStatus = 'Mining...';
let lastMined = Date.now();

function randomHex(length) {
    let str = '';
    while (str.length < length) {
        str += Math.floor(Math.random()*16).toString(16);
    }
    return str;
}

// Regenerate block and hash on interval
function autoRegenerate() {
    blockNumber++;
    blockHash = randomHex(64);
    miningStatus = 'Mined at ' + new Date().toLocaleTimeString();
    lastMined = Date.now();
    setTimeout(autoRegenerate, Math.floor(Math.random()*4000)+3000); // 3-7 seconds
}
autoRegenerate();

const app = express();
app.use(cors());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// API: Market Data (mock, replace with real API call if needed)
app.get('/api/market', (req, res) => {
    const cryptos = [ // same as market.js, you can replace with live data here
        { name: "Bitcoin", symbol: "BTC", price: 68350, change: 2.1, marketCap: "1.3T" },
        { name: "Ethereum", symbol: "ETH", price: 3200, change: 1.3, marketCap: "380B" },
        { name: "Tether", symbol: "USDT", price: 1.00, change: 0.0, marketCap: "109B" },
        { name: "BNB", symbol: "BNB", price: 540, change: -0.8, marketCap: "83B" },
        { name: "Solana", symbol: "SOL", price: 140, change: 3.2, marketCap: "62B" },
        { name: "XRP", symbol: "XRP", price: 0.48, change: 0.4, marketCap: "25B" },
        { name: "USDC", symbol: "USDC", price: 1.00, change: 0.0, marketCap: "28B" },
        { name: "Dogecoin", symbol: "DOGE", price: 0.12, change: 1.9, marketCap: "18B" },
        { name: "Cardano", symbol: "ADA", price: 0.39, change: 1.2, marketCap: "13B" },
        { name: "Toncoin", symbol: "TON", price: 2.5, change: 3.9, marketCap: "7.1B" },
        { name: "TRON", symbol: "TRX", price: 0.12, change: 0.2, marketCap: "11B" },
        { name: "Chainlink", symbol: "LINK", price: 13.2, change: 2.7, marketCap: "7.7B" },
        { name: "Polygon", symbol: "MATIC", price: 0.73, change: -1.1, marketCap: "6.8B" },
        { name: "Polkadot", symbol: "DOT", price: 4.9, change: 0.7, marketCap: "6.5B" },
        { name: "Litecoin", symbol: "LTC", price: 80, change: 1.4, marketCap: "5.7B" },
        { name: "Bitcoin Cash", symbol: "BCH", price: 240, change: 1.1, marketCap: "4.8B" },
        { name: "Shiba Inu", symbol: "SHIB", price: 0.000024, change: 1.6, marketCap: "13B" },
        { name: "Avalanche", symbol: "AVAX", price: 28, change: 2.5, marketCap: "10B" },
        { name: "Wrapped BTC", symbol: "WBTC", price: 68300, change: 2.2, marketCap: "9.8B" },
        { name: "Uniswap", symbol: "UNI", price: 6.5, change: 0.9, marketCap: "4.2B" },
        { name: "LEO Token", symbol: "LEO", price: 5.9, change: -0.7, marketCap: "5.5B" },
        { name: "Dai", symbol: "DAI", price: 1.00, change: 0.0, marketCap: "4.5B" },
        { name: "OKB", symbol: "OKB", price: 54, change: 1.0, marketCap: "3.2B" },
        { name: "Stellar", symbol: "XLM", price: 0.12, change: 0.5, marketCap: "3.7B" },
        { name: "Monero", symbol: "XMR", price: 165, change: 1.5, marketCap: "3.0B" },
        { name: "Ethereum Classic", symbol: "ETC", price: 22.5, change: 2.0, marketCap: "3.2B" },
        { name: "Cosmos", symbol: "ATOM", price: 8.9, change: 0.9, marketCap: "2.7B" },
        { name: "Filecoin", symbol: "FIL", price: 5.1, change: 1.2, marketCap: "2.3B" },
        { name: "Aptos", symbol: "APT", price: 8.2, change: 2.8, marketCap: "2.1B" },
        { name: "Immutable", symbol: "IMX", price: 1.5, change: 3.7, marketCap: "2.1B" },
        { name: "VeChain", symbol: "VET", price: 0.034, change: 2.1, marketCap: "2.5B" },
        { name: "Maker", symbol: "MKR", price: 2700, change: 0.8, marketCap: "2.6B" },
        { name: "Arbitrum", symbol: "ARB", price: 1.2, change: -1.5, marketCap: "1.7B" }
    ];
    res.json(cryptos);
});

// API: Pool status
app.get('/api/pool/status', (req, res) => {
    res.json({
        blockNumber,
        blockHash,
        miningStatus,
        lastMined
    });
});

// API: Manual block/hash regeneration
app.post('/api/pool/regenerate', (req, res) => {
    blockNumber++;
    blockHash = randomHex(64);
    miningStatus = 'Mined at ' + new Date().toLocaleTimeString();
    lastMined = Date.now();
    res.json({
        blockNumber,
        blockHash,
        miningStatus,
        lastMined
    });
});

// Explorer endpoint (demo)
app.get('/api/explorer/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json({ found: false });
    if (q === blockNumber.toString()) {
        return res.json({ found: true, type: "block", blockNumber, blockHash });
    }
    if (blockHash.startsWith(q) || blockHash.endsWith(q)) {
        return res.json({ found: true, type: "hash", blockNumber, blockHash });
    }
    res.json({ found: false });
});

// Fallback: serve index.html on unknown routes (for SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Crypto Pool Dashboard backend running on http://localhost:${PORT}`);
});