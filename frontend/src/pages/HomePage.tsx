import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { SearchBox } from '../components/SearchBox';
import { QuoteCard } from '../components/QuoteCard';
import { StockChart } from '../components/StockChart';
import { stockApi } from '../services/api';
import { storageService } from '../services/storage';
import { Quote, HistoryData, TimeRange } from '../types';

/**
 * 主页面组件
 */
export function HomePage() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [watchlistQuotes, setWatchlistQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 加载自选股列表
  useEffect(() => {
    const savedWatchlist = storageService.getWatchlist();
    setWatchlist(savedWatchlist);
    if (savedWatchlist.length > 0) {
      loadWatchlistQuotes(savedWatchlist);
    }
  }, []);

  // 加载自选股报价
  const loadWatchlistQuotes = async (symbols: string[]) => {
    try {
      const quotes = await stockApi.getBatchQuotes(symbols);
      setWatchlistQuotes(quotes);
    } catch (error) {
      console.error('Failed to load watchlist quotes:', error);
    }
  };

  // 选择股票
  const handleSelectStock = async (symbol: string) => {
    setSelectedSymbol(symbol);
    setError('');
    setIsLoading(true);

    try {
      // 并行加载报价和历史数据
      const [quoteData, historyData] = await Promise.all([
        stockApi.getQuote(symbol),
        stockApi.getHistory(symbol, timeRange),
      ]);

      setQuote(quoteData);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message || '加载数据失败');
      setQuote(null);
      setHistory(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换时间范围
  const handleRangeChange = async (range: TimeRange) => {
    if (!selectedSymbol) return;
    setTimeRange(range);

    try {
      const historyData = await stockApi.getHistory(selectedSymbol, range);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.message || '加载历史数据失败');
    }
  };

  // 切换自选股
  const handleToggleWatchlist = (symbol: string) => {
    const isInWatchlist = storageService.isInWatchlist(symbol);
    
    if (isInWatchlist) {
      storageService.removeFromWatchlist(symbol);
    } else {
      storageService.addToWatchlist(symbol);
    }

    const newWatchlist = storageService.getWatchlist();
    setWatchlist(newWatchlist);
    loadWatchlistQuotes(newWatchlist);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">股票数据可视化</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 搜索栏 */}
        <div className="mb-8">
          <SearchBox onSelect={handleSelectStock} />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}

        {/* 主要内容区 */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧 - 报价和图表 */}
            <div className="lg:col-span-2 space-y-6">
              {quote && (
                <QuoteCard
                  quote={quote}
                  isInWatchlist={storageService.isInWatchlist(quote.symbol)}
                  onToggleWatchlist={() => handleToggleWatchlist(quote.symbol)}
                  onClick={() => {}}
                />
              )}

              {history && (
                <StockChart
                  data={history}
                  currentRange={timeRange}
                  onRangeChange={handleRangeChange}
                />
              )}

              {!quote && !history && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    搜索股票开始
                  </h3>
                  <p className="text-gray-500">
                    在上方搜索框输入股票代码或公司名称
                  </p>
                </div>
              )}
            </div>

            {/* 右侧 - 自选股列表 */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  我的自选股 ({watchlist.length})
                </h2>

                {watchlistQuotes.length > 0 ? (
                  <div className="space-y-3">
                    {watchlistQuotes.map((watchQuote) => (
                      <button
                        key={watchQuote.symbol}
                        onClick={() => handleSelectStock(watchQuote.symbol)}
                        className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-bold text-gray-900">
                              {watchQuote.symbol}
                            </div>
                            <div className="text-xs text-gray-600 truncate max-w-[150px]">
                              {watchQuote.name}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${watchQuote.currentPrice.toFixed(2)}
                            </div>
                            <div
                              className={`text-xs ${
                                watchQuote.change >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {watchQuote.change >= 0 ? '+' : ''}
                              {watchQuote.changePercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    暂无自选股<br />点击星标添加
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm border-t border-gray-200">
        <p>© 2025 Stock Visualizer | 数据来源: Finnhub API</p>
      </footer>
    </div>
  );
}
