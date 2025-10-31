import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { Quote } from '../types';

interface QuoteCardProps {
  quote: Quote;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onClick: () => void;
}

/**
 * 股票报价卡片组件
 * 显示实时价格、涨跌幅等信息
 */
export function QuoteCard({ quote, isInWatchlist, onToggleWatchlist, onClick }: QuoteCardProps) {
  const isPositive = quote.change >= 0;

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  const formatPercent = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{quote.symbol}</h3>
          <p className="text-sm text-gray-600">{quote.name}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWatchlist();
          }}
          className={`p-2 rounded-full transition-colors ${
            isInWatchlist ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'
          } hover:bg-yellow-200`}
          title={isInWatchlist ? '移除自选' : '添加自选'}
        >
          <Star className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900">${formatPrice(quote.currentPrice)}</div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{formatPrice(Math.abs(quote.change))}</span>
          <span>({formatPercent(quote.changePercent)})</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-600">开盘:</span>
          <span className="ml-2 font-medium">${formatPrice(quote.open)}</span>
        </div>
        <div>
          <span className="text-gray-600">昨收:</span>
          <span className="ml-2 font-medium">${formatPrice(quote.previousClose)}</span>
        </div>
        <div>
          <span className="text-gray-600">最高:</span>
          <span className="ml-2 font-medium text-green-600">${formatPrice(quote.high)}</span>
        </div>
        <div>
          <span className="text-gray-600">最低:</span>
          <span className="ml-2 font-medium text-red-600">${formatPrice(quote.low)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        更新时间: {new Date(quote.timestamp).toLocaleString('zh-CN')}
      </div>
    </div>
  );
}
