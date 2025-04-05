# realtime-crypto-mcp-server

A real-time cryptocurrency data provider for Model Context Protocol (MCP) servers. This package integrates with the CoinCap API to provide cryptocurrency exchange details and current rates.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- Get detailed cryptocurrency exchange information (volumes, rankings, trading pairs)
- Fetch current cryptocurrency rates in USD
- Built-in rate limiting and retry mechanisms for API requests
- Fully typed with TypeScript
- Compatible with MCP server SDK

## Installation

```bash
npm install realtime-crypto-mcp-server


# Crypto Exchange & Rates Toolkit

This package provides tools to retrieve detailed information about cryptocurrency exchanges and current exchange rates for cryptocurrencies using the CoinCap API.

---

## 🔧 API Reference

### `getExchangeDetailsTool`
Get detailed information about cryptocurrency exchanges.

**Input:**
- `exchange` (string): Exchange ID (e.g., `binance`, `coinbase`, `kraken`)

**Example Response:**
Exchange details for Binance:

Name: Binance  
Rank: 1  
Volume (USD): $14,789,244,354.70  
% of Total Volume: 31.39%  
Trading Pairs: 1078  
Website: https://www.binance.com/  
Last Updated: 4/5/2025, 12:34:56 PM


---

### `getRatesTool`
Get current exchange rates for cryptocurrencies.

**Input:**
- `currency` (string): Cryptocurrency ID (e.g., `bitcoin`, `ethereum`, `litecoin`)

**Example Response:**
Current rate for bitcoin:

Symbol: BTC ₿
Type: crypto
USD Rate: $82,821.30


---

## 🧠 Data Source
This package uses data from the [CoinCap API](https://docs.coincap.io/), a free cryptocurrency market data API that provides real-time pricing and market activity for over 1,000 cryptocurrencies.

---

## ⏱️ Rate Limiting

The package includes built-in rate limiting and retry mechanisms to handle CoinCap API's rate limits.

- Maximum **3 retries** for rate-limited requests  
- **Exponential backoff** starting at 1 second

---

## 📄 License

MIT

---

## 👨‍💻 Author

**Mohan Kumar**

---

## 🙏 Acknowledgements

- [CoinCap API](https://coincap.io) for providing cryptocurrency market data  
- Model Context Protocol for the MCP server framework
