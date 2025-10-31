import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { HistoryData, TimeRange } from '../types';

interface StockChartProps {
  data: HistoryData;
  onRangeChange: (range: TimeRange) => void;
  currentRange: TimeRange;
}

const TIME_RANGES: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1日' },
  { value: '1W', label: '1周' },
  { value: '1M', label: '1月' },
  { value: '3M', label: '3月' },
  { value: '1Y', label: '1年' },
];

/**
 * 股票历史数据图表组件
 * 使用 Recharts 绘制折线图
 */
export function StockChart({ data, onRangeChange, currentRange }: StockChartProps) {
  // 格式化图表数据
  const chartData = data.data.map((point) => ({
    time: new Date(point.timestamp).toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: currentRange === '1D' ? 'numeric' : undefined,
    }),
    price: point.close,
    volume: point.volume,
  }));

  // 计算价格涨跌
  const firstPrice = data.data[0]?.close || 0;
  const lastPrice = data.data[data.data.length - 1]?.close || 0;
  const priceChange = lastPrice - firstPrice;
  const isPositive = priceChange >= 0;

  // 自定义 Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="text-sm text-gray-600">{payload[0].payload.time}</p>
          <p className="text-lg font-bold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{data.symbol} 走势图</h3>
          <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{priceChange.toFixed(2)} (
            {((priceChange / firstPrice) * 100).toFixed(2)}%)
          </p>
        </div>

        {/* 时间范围选择器 */}
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => onRangeChange(range.value)}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                currentRange === range.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* 图表 */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>

      {data.data.length === 0 && (
        <div className="flex items-center justify-center h-64 text-gray-500">
          暂无历史数据
        </div>
      )}
    </div>
  );
}
