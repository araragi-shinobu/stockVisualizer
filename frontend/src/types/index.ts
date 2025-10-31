// API 响应类型
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: number;
}

// 股票报价类型
export interface Quote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  volume?: number;
  timestamp: number;
}

// 历史数据点
export interface DataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// 历史数据响应
export interface HistoryData {
  symbol: string;
  range: string;
  data: DataPoint[];
}

// 搜索结果
export interface SearchResult {
  symbol: string;
  name: string;
}

// 时间范围选项
export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y';

// 自选股列表
export interface Watchlist {
  symbols: string[];
}
