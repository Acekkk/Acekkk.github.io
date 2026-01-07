import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CryptoPrices = () => {
    const [prices, setPrices] = useState({});
    const [priceChanges, setPriceChanges] = useState({});
    const [loading, setLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const reconnectAttemptsRef = useRef(0);

    // 币种配置
    const cryptos = [
        { symbol: 'BTCUSDT', displaySymbol: 'BTC', icon: '₿', color: 'from-orange-400 to-orange-600', name: 'Bitcoin' },
        { symbol: 'ETHUSDT', displaySymbol: 'ETH', icon: 'Ξ', color: 'from-blue-400 to-purple-600', name: 'Ethereum' },
        { symbol: 'SOLUSDT', displaySymbol: 'SOL', icon: '◎', color: 'from-purple-400 to-pink-600', name: 'Solana' },
        { symbol: 'TRXUSDT', displaySymbol: 'TRX', icon: '⟁', color: 'from-red-400 to-red-600', name: 'Tron' }
    ];

    // 使用 REST API 作为备用方案
    const fetchPricesREST = async () => {
        try {
            const symbols = cryptos.map(c => c.symbol).join(',');
            const response = await fetch(
                `https://api.binance.com/api/v3/ticker/24hr?symbols=["${cryptos.map(c => `"${c.symbol}"`).join('","')}"]`
            );

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            const newPrices = {};

            data.forEach(ticker => {
                newPrices[ticker.symbol] = {
                    price: parseFloat(ticker.lastPrice),
                    change24h: parseFloat(ticker.priceChangePercent)
                };
            });

            setPrices(newPrices);
            setLoading(false);
            setError(null);
        } catch (err) {
            console.error('REST API 获取失败:', err);
            setError('无法获取价格数据');
            setLoading(false);
        }
    };

    const connectWebSocket = () => {
        try {
            // 如果重连次数太多，切换到 REST API
            if (reconnectAttemptsRef.current > 3) {
                console.log('WebSocket 重连失败次数过多，切换到 REST API');
                setConnected(false);
                setLoading(false);
                fetchPricesREST();
                // 使用定时器定期更新
                const interval = setInterval(fetchPricesREST, 5000);
                return () => clearInterval(interval);
            }

            console.log('尝试连接 WebSocket...');
            // 使用不带端口的 URL
            const streams = cryptos.map(c => `${c.symbol.toLowerCase()}@ticker`).join('/');
            const wsUrl = `wss://stream.binance.com/stream?streams=${streams}`;

            console.log('WebSocket URL:', wsUrl);

            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log('✅ WebSocket 连接成功');
                setConnected(true);
                setLoading(false);
                setError(null);
                reconnectAttemptsRef.current = 0;
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.data) {
                        const ticker = data.data;
                        const symbol = ticker.s;
                        const currentPrice = parseFloat(ticker.c);
                        const priceChange24h = parseFloat(ticker.P);

                        setPrices(prev => {
                            const oldPrice = prev[symbol]?.price;
                            if (oldPrice !== undefined && oldPrice !== currentPrice) {
                                setPriceChanges(prevChanges => ({
                                    ...prevChanges,
                                    [symbol]: currentPrice > oldPrice ? 'up' : 'down'
                                }));
                                setTimeout(() => {
                                    setPriceChanges(prevChanges => ({
                                        ...prevChanges,
                                        [symbol]: null
                                    }));
                                }, 2000);
                            }

                            return {
                                ...prev,
                                [symbol]: {
                                    price: currentPrice,
                                    change24h: priceChange24h
                                }
                            };
                        });
                    }
                } catch (err) {
                    console.error('❌ 解析消息失败:', err);
                }
            };

            ws.onerror = (error) => {
                console.error('❌ WebSocket 错误:', error);
                setConnected(false);
                setError('连接失败');
            };

            ws.onclose = (event) => {
                console.log('🔌 WebSocket 连接关闭, code:', event.code, 'reason:', event.reason);
                setConnected(false);
                reconnectAttemptsRef.current += 1;

                // 5秒后尝试重连
                reconnectTimeoutRef.current = setTimeout(() => {
                    console.log(`🔄 第 ${reconnectAttemptsRef.current} 次重连尝试...`);
                    connectWebSocket();
                }, 5000);
            };

            wsRef.current = ws;
        } catch (err) {
            console.error('❌ 创建 WebSocket 失败:', err);
            setLoading(false);
            setError('连接失败');
            // 使用 REST API 作为后备
            fetchPricesREST();
        }
    };

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const formatPrice = (price) => {
        if (!price) return '---';
        return price < 1
            ? `$${price.toFixed(6)}`
            : `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatChange = (change) => {
        if (change === undefined || change === null) return '0.00';
        return Math.abs(change).toFixed(2);
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
        >
            <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-white/10 hover:border-orange-500/30 transition-all">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-purple-500/10 blur-3xl rounded-full pointer-events-none"></div>

                {/* 标题区域 */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center text-3xl shadow-lg shadow-orange-500/20">
                        ₿
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            加密货币实时价格
                            <span className={`inline-flex h-2 w-2 rounded-full ${connected ? 'bg-green-400' : 'bg-orange-400'} animate-pulse`}></span>
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {connected ? '实时推送 · Live Stream' : error ? error : '正在连接...'}
                        </p>
                    </div>
                </div>

                {/* 价格列表 */}
                <div className="space-y-3 relative z-10">
                    <AnimatePresence mode="wait">
                        {loading ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-8"
                            >
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="prices"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                            >
                                {cryptos.map((crypto, index) => {
                                    const priceData = prices[crypto.symbol];
                                    const price = priceData?.price;
                                    const change = priceData?.change24h;
                                    const isPositive = change >= 0;
                                    const priceChange = priceChanges[crypto.symbol];

                                    return (
                                        <motion.div
                                            key={crypto.symbol}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative group"
                                        >
                                            {/* 悬浮光效 */}
                                            <div className={`absolute inset-0 bg-gradient-to-r ${crypto.color} opacity-0 group-hover:opacity-10 rounded-xl blur-sm transition-opacity duration-300`}></div>

                                            <div className="relative bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 rounded-xl p-4 transition-all duration-300">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${crypto.color} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                                                        {crypto.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-bold text-base">{crypto.displaySymbol}</div>
                                                        <div className="text-slate-500 text-xs">{crypto.name}</div>
                                                    </div>
                                                </div>

                                                {/* 价格和涨跌幅 */}
                                                <div className="space-y-2">
                                                    <motion.div
                                                        key={price}
                                                        initial={{ scale: 1 }}
                                                        animate={{
                                                            scale: priceChange ? [1, 1.05, 1] : 1,
                                                            color: priceChange === 'up' ? '#4ade80' : priceChange === 'down' ? '#f87171' : '#ffffff'
                                                        }}
                                                        transition={{ duration: 0.3 }}
                                                        className="text-white font-bold text-lg font-mono"
                                                    >
                                                        {formatPrice(price)}
                                                    </motion.div>
                                                    <div
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold ${isPositive
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : 'bg-red-500/20 text-red-400'
                                                            }`}
                                                    >
                                                        <span>{isPositive ? '▲' : '▼'}</span>
                                                        <span>{formatChange(change)}%</span>
                                                        <span className="text-slate-500">24h</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 底部信息 */}
                <div className="mt-4 flex items-center justify-center text-[10px] text-slate-600 relative z-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                        <span>{connected ? 'Live · Binance Stream' : 'Auto Update · REST API'}</span>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
};

export default CryptoPrices;
